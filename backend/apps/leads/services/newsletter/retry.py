import logging

from apps.leads.models import (
    ArticleQuestion,
    ContactInquiry,
    LeadEvent,
    SubscriberReference,
)

from .base import InquiryNotifyRequest, QuestionNotifyRequest, SubscribeRequest
from .brevo import BrevoError, BrevoProvider

logger = logging.getLogger(__name__)


def _provider() -> BrevoProvider:
    return BrevoProvider()


def _latest_subscribe_name(email: str) -> str:
    event = (
        LeadEvent.objects.filter(
            event_type=LeadEvent.EventType.SUBSCRIBE,
            email=email,
        )
        .order_by("-created_at")
        .first()
    )
    if not event:
        return ""
    return str((event.metadata or {}).get("name", "")).strip()


def retry_subscriber_doi(subscriber: SubscriberReference) -> dict:
    provider = _provider()
    if not provider.is_configured():
        return {"kind": "doi", "id": subscriber.pk, "status": "skipped"}

    name = _latest_subscribe_name(subscriber.email)
    try:
        result = provider.subscribe_doi(
            SubscribeRequest(
                email=subscriber.email,
                locale=subscriber.locale,
                name=name,
                source=subscriber.first_source,
                article_slug=subscriber.first_article_slug,
            )
        )
    except BrevoError as exc:
        logger.exception("Retry DOI failed for %s", subscriber.email)
        return {
            "kind": "doi",
            "id": subscriber.pk,
            "status": "failed",
            "error": str(exc),
        }

    updates = {
        "brevo_pending": False,
        "brevo_list_id": result.list_id,
    }
    if result.contact_id:
        updates["brevo_contact_id"] = result.contact_id
    SubscriberReference.objects.filter(pk=subscriber.pk).update(**updates)
    return {"kind": "doi", "id": subscriber.pk, "status": "sent"}


def retry_question_notify(question: ArticleQuestion) -> dict:
    provider = _provider()
    if not provider.is_question_notify_configured():
        return {"kind": "question", "id": question.pk, "status": "skipped"}

    try:
        result = provider.send_question_notification(
            QuestionNotifyRequest(
                name=question.name,
                email=question.email,
                question=question.question,
                article_title=question.article_title,
                article_slug=question.article_slug,
                locale=question.locale,
                page_path="",
            )
        )
    except BrevoError as exc:
        logger.exception("Retry question notify failed for %s", question.pk)
        return {
            "kind": "question",
            "id": question.pk,
            "status": "failed",
            "error": str(exc),
        }

    ArticleQuestion.objects.filter(pk=question.pk).update(brevo_synced=True)
    return {
        "kind": "question",
        "id": question.pk,
        "status": "sent",
        "message_id": result.message_id,
    }


def retry_inquiry_notify(inquiry: ContactInquiry) -> dict:
    provider = _provider()
    if not provider.is_inquiry_notify_configured():
        return {"kind": "inquiry", "id": inquiry.pk, "status": "skipped"}

    try:
        result = provider.send_inquiry_notification(
            InquiryNotifyRequest(
                name=inquiry.name,
                email=inquiry.email,
                message=inquiry.message,
                request_type=inquiry.request_type,
                locale=inquiry.locale,
                page_path=inquiry.source_page,
            )
        )
    except BrevoError as exc:
        logger.exception("Retry inquiry notify failed for %s", inquiry.pk)
        return {
            "kind": "inquiry",
            "id": inquiry.pk,
            "status": "failed",
            "error": str(exc),
        }

    ContactInquiry.objects.filter(pk=inquiry.pk).update(brevo_synced=True)
    return {
        "kind": "inquiry",
        "id": inquiry.pk,
        "status": "sent",
        "message_id": result.message_id,
    }


def retry_pending_brevo_syncs(*, limit: int = 50) -> list[dict]:
    results: list[dict] = []

    for subscriber in SubscriberReference.objects.filter(
        brevo_pending=True, newsletter=True
    ).order_by("updated_at")[:limit]:
        results.append(retry_subscriber_doi(subscriber))

    remaining = limit - len(results)
    if remaining > 0:
        for question in ArticleQuestion.objects.filter(brevo_synced=False).order_by(
            "created_at"
        )[:remaining]:
            results.append(retry_question_notify(question))

    remaining = limit - len(results)
    if remaining > 0:
        for inquiry in ContactInquiry.objects.filter(brevo_synced=False).order_by(
            "created_at"
        )[:remaining]:
            results.append(retry_inquiry_notify(inquiry))

    return results
