import json
import logging
from urllib import error, request

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

logger = logging.getLogger(__name__)


class BrevoError(Exception):
    """Raised when Brevo API call fails."""


class BrevoProvider:
    DOI_API_URL = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation"
    SMTP_API_URL = "https://api.brevo.com/v3/smtp/email"
    CAMPAIGNS_API_URL = "https://api.brevo.com/v3/emailCampaigns"

    def is_configured(self) -> bool:
        return bool(
            settings.BREVO_API_KEY
            and settings.BREVO_LIST_ID_BLOG
            and settings.BREVO_DOI_TEMPLATE_ID
        )

    def is_question_notify_configured(self) -> bool:
        return bool(
            settings.BREVO_API_KEY
            and settings.BREVO_TEMPLATE_QUESTION_NOTIFY
            and settings.BREVO_SENDER_EMAIL
            and self._notify_recipient()
        )

    def subscribe_doi(self, subscribe_request: SubscribeRequest) -> SubscribeResult:
        if not self.is_configured():
            raise BrevoError("Brevo subscribe is not configured")

        list_id = int(settings.BREVO_LIST_ID_BLOG)
        template_id = int(settings.BREVO_DOI_TEMPLATE_ID)

        payload = {
            "email": subscribe_request.email,
            "includeListIds": [list_id],
            "templateId": template_id,
            "redirectionUrl": self._redirect_url(subscribe_request.locale),
        }

        attributes = self._build_subscribe_attributes(subscribe_request)
        if attributes:
            payload["attributes"] = attributes

        response_data = self._post_json(self.DOI_API_URL, payload)
        contact_id = response_data.get("id")
        return SubscribeResult(
            contact_id=str(contact_id) if contact_id is not None else "",
            list_id=str(list_id),
        )

    def send_question_notification(
        self, notify_request: QuestionNotifyRequest
    ) -> QuestionNotifyResult:
        if not self.is_question_notify_configured():
            raise BrevoError("Brevo question notify is not configured")

        recipient = self._notify_recipient()
        sender_name = settings.BREVO_SENDER_NAME.strip() or "Website"
        template_id = int(settings.BREVO_TEMPLATE_QUESTION_NOTIFY)

        payload = {
            "sender": {
                "email": settings.BREVO_SENDER_EMAIL.strip(),
                "name": sender_name,
            },
            "to": [{"email": recipient}],
            "replyTo": {
                "email": notify_request.email,
                "name": notify_request.name,
            },
            "templateId": template_id,
            "params": {
                "NAME": notify_request.name,
                "EMAIL": notify_request.email,
                "QUESTION": notify_request.question,
                "ARTICLE_TITLE": notify_request.article_title,
                "ARTICLE_SLUG": notify_request.article_slug,
                "LOCALE": notify_request.locale,
                "PAGE_PATH": notify_request.page_path,
            },
        }

        response_data = self._post_json(self.SMTP_API_URL, payload)
        message_id = response_data.get("messageId", "")
        return QuestionNotifyResult(message_id=str(message_id))

    def is_inquiry_notify_configured(self) -> bool:
        return bool(
            settings.BREVO_API_KEY
            and settings.BREVO_TEMPLATE_INQUIRY_NOTIFY
            and settings.BREVO_SENDER_EMAIL
            and self._notify_recipient()
        )

    def send_inquiry_notification(
        self, notify_request: InquiryNotifyRequest
    ) -> InquiryNotifyResult:
        if not self.is_inquiry_notify_configured():
            raise BrevoError("Brevo inquiry notify is not configured")

        recipient = self._notify_recipient()
        sender_name = settings.BREVO_SENDER_NAME.strip() or "Website"
        template_id = int(settings.BREVO_TEMPLATE_INQUIRY_NOTIFY)

        payload = {
            "sender": {
                "email": settings.BREVO_SENDER_EMAIL.strip(),
                "name": sender_name,
            },
            "to": [{"email": recipient}],
            "replyTo": {
                "email": notify_request.email,
                "name": notify_request.name,
            },
            "templateId": template_id,
            "params": {
                "NAME": notify_request.name,
                "EMAIL": notify_request.email,
                "MESSAGE": notify_request.message,
                "REQUEST_TYPE": notify_request.request_type,
                "LOCALE": notify_request.locale,
                "PAGE_PATH": notify_request.page_path,
            },
        }

        response_data = self._post_json(self.SMTP_API_URL, payload)
        message_id = response_data.get("messageId", "")
        return InquiryNotifyResult(message_id=str(message_id))

    def send_reply_email(self, reply_request: ReplyEmailRequest) -> ReplyEmailResult:
        if not (settings.BREVO_API_KEY and settings.BREVO_SENDER_EMAIL):
            raise BrevoError("Brevo reply email is not configured")

        sender_name = settings.BREVO_SENDER_NAME.strip() or "Website"
        payload = {
            "sender": {
                "email": settings.BREVO_SENDER_EMAIL.strip(),
                "name": sender_name,
            },
            "to": [{"email": reply_request.to_email, "name": reply_request.to_name}],
            "subject": reply_request.subject,
            "htmlContent": reply_request.html_content,
        }

        response_data = self._post_json(self.SMTP_API_URL, payload)
        message_id = response_data.get("messageId", "")
        return ReplyEmailResult(message_id=str(message_id))

    def is_campaign_configured(self) -> bool:
        return bool(
            settings.BREVO_API_KEY
            and settings.BREVO_LIST_ID_BLOG
            and settings.BREVO_SENDER_EMAIL
        )

    def send_email_campaign(
        self,
        *,
        name: str,
        subject: str,
        html_content: str = "",
        template_id: int | None = None,
        params: dict | None = None,
        segment_ids: list[int] | None = None,
    ) -> str:
        if not self.is_campaign_configured():
            raise BrevoError("Brevo campaign is not configured")

        list_id = int(settings.BREVO_LIST_ID_BLOG)
        recipients: dict = {"listIds": [list_id]}
        if segment_ids:
            recipients = {"segmentIds": segment_ids}

        payload: dict = {
            "name": name,
            "subject": subject,
            "sender": {
                "email": settings.BREVO_SENDER_EMAIL.strip(),
                "name": settings.BREVO_SENDER_NAME.strip() or "Blog",
            },
            "recipients": recipients,
        }

        if template_id:
            payload["templateId"] = template_id
            if params:
                payload["params"] = params
        elif html_content:
            payload["htmlContent"] = html_content
        else:
            raise BrevoError("Campaign requires templateId or htmlContent")

        created = self._post_json(self.CAMPAIGNS_API_URL, payload)
        campaign_id = created.get("id")
        if campaign_id is None:
            raise BrevoError("Brevo campaign id missing in response")

        self._post_json(
            f"{self.CAMPAIGNS_API_URL}/{campaign_id}/sendNow",
            {},
        )
        return str(campaign_id)

    def _notify_recipient(self) -> str:
        configured = settings.BREVO_NOTIFY_EMAIL.strip()
        if configured:
            return configured

        from apps.pages.models import Contact

        contact = Contact.objects.first()
        return contact.email if contact else ""

    def _build_subscribe_attributes(self, subscribe_request: SubscribeRequest) -> dict:
        attributes = {}
        if subscribe_request.name:
            attributes["FIRSTNAME"] = subscribe_request.name
        if subscribe_request.locale:
            attributes["LANGUAGE"] = subscribe_request.locale
        return attributes

    def _redirect_url(self, locale: str) -> str:
        template = settings.BREVO_DOI_REDIRECT_URL.strip()
        if template:
            return template.replace("{locale}", locale)

        origin = "http://localhost:3000"
        if settings.CORS_ALLOWED_ORIGINS:
            origin = settings.CORS_ALLOWED_ORIGINS[0].strip()
        return f"{origin.rstrip('/')}/{locale}/blog?newsletter=confirmed"

    def _post_json(self, url: str, payload: dict) -> dict:
        body = json.dumps(payload).encode("utf-8")
        api_request = request.Request(
            url,
            data=body,
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": settings.BREVO_API_KEY,
            },
            method="POST",
        )

        try:
            with request.urlopen(api_request, timeout=15) as response:
                raw = response.read().decode("utf-8")
                if not raw.strip():
                    return {}
                return json.loads(raw)
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            logger.error("Brevo API failed (%s) %s: %s", url, exc.code, detail)
            raise BrevoError(f"Brevo API error {exc.code}") from exc
        except error.URLError as exc:
            logger.error("Brevo API unavailable %s: %s", url, exc.reason)
            raise BrevoError(f"Brevo API unavailable: {exc.reason}") from exc


# Backward-compatible alias used in tests and imports.
BrevoNewsletterProvider = BrevoProvider
