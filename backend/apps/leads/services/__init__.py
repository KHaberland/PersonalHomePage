import hashlib
import logging

from django.conf import settings
from django.db import transaction

from apps.blog.models import Post
from apps.pages.models import SiteTextBlock

from ..models import ArticleQuestion, ContactInquiry, LeadEvent, SubscriberReference
from .newsletter import (
    BrevoError,
    notify_article_question,
    notify_contact_inquiry,
    sync_subscribe_to_brevo,
)

logger = logging.getLogger(__name__)


def hash_ip(ip: str) -> str:
    if not ip:
        return ""
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


def get_client_ip(request) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "") or ""


def get_cms_success_message(
    block: str, key: str, locale: str, *, page: str = "blog"
) -> str:
    try:
        cms_block = SiteTextBlock.objects.get(page=page, block=block, key=key)
    except SiteTextBlock.DoesNotExist:
        return ""

    if locale == "ru" and cms_block.text_ru.strip():
        return cms_block.text_ru
    if locale == "lv" and cms_block.text_lv.strip():
        return cms_block.text_lv
    return cms_block.text_en or ""


def _create_lead_event(event_type, email, locale, data, article_slug="", metadata=None):
    return LeadEvent.objects.create(
        event_type=event_type,
        email=email,
        locale=locale,
        page_path=data.get("page_path", ""),
        article_slug=article_slug or data.get("article_slug", ""),
        referrer=data.get("referrer", ""),
        utm_source=data.get("utm_source", ""),
        utm_medium=data.get("utm_medium", ""),
        utm_campaign=data.get("utm_campaign", ""),
        metadata=metadata or {},
    )


def _upsert_subscriber(email, locale, source, article_slug=""):
    subscriber, created = SubscriberReference.objects.get_or_create(
        email=email,
        defaults={
            "locale": locale,
            "newsletter": True,
            "first_source": source,
            "first_article_slug": article_slug,
        },
    )
    if not created:
        SubscriberReference.objects.filter(pk=subscriber.pk).update(
            locale=locale,
            newsletter=True,
        )
        subscriber.refresh_from_db()
    return subscriber, created


def _apply_brevo_subscribe_result(subscriber, brevo_result):
    if brevo_result is None:
        return

    updates = {"brevo_list_id": brevo_result.list_id, "brevo_pending": False}
    if brevo_result.contact_id:
        updates["brevo_contact_id"] = brevo_result.contact_id
    SubscriberReference.objects.filter(pk=subscriber.pk).update(**updates)
    subscriber.refresh_from_db()


def _send_brevo_question_notify(question_pk: int, data):
    question = ArticleQuestion.objects.get(pk=question_pk)
    try:
        result = notify_article_question(
            name=question.name,
            email=question.email,
            question=question.question,
            article_title=question.article_title,
            article_slug=question.article_slug,
            locale=question.locale,
            page_path=data.get("page_path", ""),
        )
    except BrevoError:
        logger.exception("Brevo question notify failed for question %s", question_pk)
        return

    if result is not None:
        ArticleQuestion.objects.filter(pk=question_pk).update(brevo_synced=True)


def _send_brevo_doi(subscriber, data, *, name=""):
    email = data["email"].lower().strip()
    locale = data["locale"]
    article_slug = data.get("article_slug", "")

    try:
        brevo_result = sync_subscribe_to_brevo(
            email=email,
            locale=locale,
            name=name,
            source=subscriber.first_source,
            article_slug=article_slug,
        )
    except BrevoError:
        logger.exception("Brevo DOI failed for %s", email)
        SubscriberReference.objects.filter(pk=subscriber.pk).update(brevo_pending=True)
        return

    if brevo_result is None:
        SubscriberReference.objects.filter(pk=subscriber.pk).update(brevo_pending=True)
        return

    _apply_brevo_subscribe_result(subscriber, brevo_result)


@transaction.atomic
def process_subscribe(data, ip_hash: str):
    email = data["email"].lower().strip()
    locale = data["locale"]
    article_slug = data.get("article_slug", "")

    subscriber, _created = _upsert_subscriber(
        email,
        locale,
        SubscriberReference.Source.BLOG_SUBSCRIBE,
        article_slug,
    )

    metadata = {}
    name = (data.get("name") or "").strip()
    if name:
        metadata["name"] = name

    _create_lead_event(
        LeadEvent.EventType.SUBSCRIBE,
        email,
        locale,
        data,
        article_slug=article_slug,
        metadata=metadata,
    )

    message = get_cms_success_message("newsletter", "success", locale)

    transaction.on_commit(lambda: _send_brevo_doi(subscriber, data, name=name))

    return message


@transaction.atomic
def process_article_question(data, ip_hash: str):
    email = data["email"].lower().strip()
    locale = data["locale"]
    article_slug = data["article_slug"]
    post = Post.objects.filter(slug=article_slug).first()

    question = ArticleQuestion.objects.create(
        name=data["name"].strip(),
        email=email,
        locale=locale,
        post=post,
        article_slug=article_slug,
        article_title=data["article_title"].strip(),
        question=data["question"].strip(),
        subscribe_opt_in=data.get("subscribe_opt_in", False),
        ip_hash=ip_hash,
    )
    question_pk = question.pk

    _create_lead_event(
        LeadEvent.EventType.QUESTION_SENT,
        email,
        locale,
        data,
        article_slug=article_slug,
    )

    subscriber = None
    if data.get("subscribe_opt_in"):
        subscriber, _created = _upsert_subscriber(
            email,
            locale,
            SubscriberReference.Source.ARTICLE_QUESTION,
            article_slug,
        )
        _create_lead_event(
            LeadEvent.EventType.SUBSCRIBE,
            email,
            locale,
            data,
            article_slug=article_slug,
            metadata={"source": "article_question"},
        )

    message = get_cms_success_message("article_question", "success", locale)

    transaction.on_commit(lambda: _send_brevo_question_notify(question_pk, data))

    if subscriber is not None:
        subscriber_pk = subscriber.pk
        name = data["name"].strip()
        transaction.on_commit(
            lambda: _send_brevo_doi(
                SubscriberReference.objects.get(pk=subscriber_pk),
                data,
                name=name,
            )
        )

    return message


def _send_brevo_inquiry_notify(inquiry_pk: int):
    inquiry = ContactInquiry.objects.get(pk=inquiry_pk)
    try:
        result = notify_contact_inquiry(
            name=inquiry.name,
            email=inquiry.email,
            message=inquiry.message,
            request_type=inquiry.request_type,
            locale=inquiry.locale,
            page_path=inquiry.source_page,
        )
    except BrevoError:
        logger.exception("Brevo inquiry notify failed for inquiry %s", inquiry_pk)
        return

    if result is not None:
        ContactInquiry.objects.filter(pk=inquiry_pk).update(brevo_synced=True)


@transaction.atomic
def process_contact_inquiry(data, ip_hash: str):
    email = data["email"].lower().strip()
    locale = data["locale"]

    inquiry = ContactInquiry.objects.create(
        name=data["name"].strip(),
        email=email,
        locale=locale,
        request_type=data["request_type"],
        message=data["message"].strip(),
        source_page=data.get("page_path", ""),
        ip_hash=ip_hash,
    )
    inquiry_pk = inquiry.pk

    _create_lead_event(
        LeadEvent.EventType.INQUIRY_SENT,
        email,
        locale,
        data,
        metadata={"request_type": data["request_type"]},
    )

    transaction.on_commit(lambda: _send_brevo_inquiry_notify(inquiry_pk))

    return get_cms_success_message("form", "formSuccess", locale, page="contact")


def get_article_faq(article_slug: str, locale: str) -> list[dict]:
    queryset = (
        ArticleQuestion.objects.filter(
            article_slug=article_slug,
            locale=locale,
            answered=True,
        )
        .exclude(answer_text="")
        .order_by("-answered_at", "-created_at")
    )
    return [
        {
            "question": item.question,
            "answer": item.answer_text,
            "answered_at": item.answered_at.isoformat() if item.answered_at else None,
        }
        for item in queryset
    ]


def _normalize_brevo_list_ids(payload: dict) -> list[int]:
    raw = payload.get("list_id") or payload.get("listId") or []
    if isinstance(raw, int):
        return [raw]
    if not isinstance(raw, list):
        return []
    result = []
    for item in raw:
        try:
            result.append(int(item))
        except (TypeError, ValueError):
            continue
    return result


def _blog_list_id() -> int | None:
    raw = settings.BREVO_LIST_ID_BLOG.strip()
    if not raw:
        return None
    try:
        return int(raw)
    except ValueError:
        return None


def process_brevo_list_addition(email: str, list_ids: list[int]) -> bool:
    blog_list_id = _blog_list_id()
    if blog_list_id is not None and blog_list_id not in list_ids:
        return False

    email = email.lower().strip()
    if not email:
        return False

    subscriber = SubscriberReference.objects.filter(email=email).first()
    if subscriber:
        if subscriber.doi_confirmed:
            return True
        SubscriberReference.objects.filter(pk=subscriber.pk).update(
            doi_confirmed=True,
            newsletter=True,
        )
        locale = subscriber.locale
    else:
        SubscriberReference.objects.create(
            email=email,
            locale="en",
            newsletter=True,
            doi_confirmed=True,
            first_source=SubscriberReference.Source.OTHER,
        )
        locale = "en"

    LeadEvent.objects.create(
        event_type=LeadEvent.EventType.DOI_CONFIRMED,
        email=email,
        locale=locale,
        metadata={"source": "brevo_webhook", "list_ids": list_ids},
    )
    return True


def process_brevo_unsubscribe(email: str) -> bool:
    email = email.lower().strip()
    if not email:
        return False

    subscriber = SubscriberReference.objects.filter(email=email).first()
    if not subscriber:
        return False

    updates = {"newsletter": False}
    if subscriber.doi_confirmed:
        updates["doi_confirmed"] = False
    SubscriberReference.objects.filter(pk=subscriber.pk).update(**updates)

    LeadEvent.objects.create(
        event_type=LeadEvent.EventType.UNSUBSCRIBE,
        email=email,
        locale=subscriber.locale,
        metadata={"source": "brevo_webhook"},
    )
    return True


def process_brevo_webhook_event(payload: dict) -> bool:
    event = str(payload.get("event", "")).strip()
    email = str(payload.get("email", "")).strip()

    if event in {"list_addition", "listAddition"}:
        return process_brevo_list_addition(email, _normalize_brevo_list_ids(payload))

    if event in {"unsubscribe", "unsubscribed", "marketingUnsubscribed"}:
        return process_brevo_unsubscribe(email)

    return False
