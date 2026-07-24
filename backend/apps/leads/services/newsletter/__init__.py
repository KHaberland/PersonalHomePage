from django.conf import settings

from .base import (
    InquiryNotifyRequest,
    InquiryNotifyResult,
    QuestionNotifyRequest,
    QuestionNotifyResult,
    ReplyEmailRequest,
    ReplyEmailResult,
    SubscribeRequest,
    SubscribeResult,
)
from .brevo import BrevoError, BrevoProvider
from .campaign import send_post_newsletter
from .retry import retry_pending_brevo_syncs


def get_newsletter_provider() -> BrevoProvider:
    return BrevoProvider()


def sync_subscribe_to_brevo(
    *,
    email: str,
    locale: str,
    name: str = "",
    source: str = "",
    article_slug: str = "",
) -> SubscribeResult | None:
    provider = get_newsletter_provider()
    if not provider.is_configured():
        return None

    result = provider.subscribe_doi(
        SubscribeRequest(
            email=email,
            locale=locale,
            name=name,
            source=source,
            article_slug=article_slug,
        )
    )
    return result


def notify_article_question(
    *,
    name: str,
    email: str,
    question: str,
    article_title: str,
    article_slug: str,
    locale: str,
    page_path: str = "",
) -> QuestionNotifyResult | None:
    provider = get_newsletter_provider()
    if not provider.is_question_notify_configured():
        return None

    return provider.send_question_notification(
        QuestionNotifyRequest(
            name=name,
            email=email,
            question=question,
            article_title=article_title,
            article_slug=article_slug,
            locale=locale,
            page_path=page_path,
        )
    )


def notify_contact_inquiry(
    *,
    name: str,
    email: str,
    message: str,
    request_type: str,
    locale: str,
    page_path: str = "",
) -> InquiryNotifyResult | None:
    provider = get_newsletter_provider()
    if not provider.is_inquiry_notify_configured():
        return None

    return provider.send_inquiry_notification(
        InquiryNotifyRequest(
            name=name,
            email=email,
            message=message,
            request_type=request_type,
            locale=locale,
            page_path=page_path,
        )
    )


def send_lead_reply_email(
    *,
    to_email: str,
    to_name: str,
    subject: str,
    html_content: str,
) -> ReplyEmailResult | None:
    provider = get_newsletter_provider()
    if not (settings.BREVO_API_KEY and settings.BREVO_SENDER_EMAIL):
        return None

    return provider.send_reply_email(
        ReplyEmailRequest(
            to_email=to_email,
            to_name=to_name,
            subject=subject,
            html_content=html_content,
        )
    )


__all__ = [
    "BrevoError",
    "InquiryNotifyRequest",
    "InquiryNotifyResult",
    "QuestionNotifyRequest",
    "QuestionNotifyResult",
    "ReplyEmailRequest",
    "ReplyEmailResult",
    "SubscribeRequest",
    "SubscribeResult",
    "get_newsletter_provider",
    "notify_article_question",
    "notify_contact_inquiry",
    "retry_pending_brevo_syncs",
    "send_lead_reply_email",
    "send_post_newsletter",
    "sync_subscribe_to_brevo",
]
