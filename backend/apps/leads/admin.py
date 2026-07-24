from django.contrib import admin

from django.utils import timezone
from django.utils.html import escape

from .models import ArticleQuestion, ContactInquiry, LeadEvent, SubscriberReference
from .services.newsletter import send_lead_reply_email


def _answer_html(answer_text: str) -> str:
    lines = [line.strip() for line in answer_text.splitlines() if line.strip()]
    if not lines:
        return f"<p>{escape(answer_text.strip())}</p>"
    return "".join(f"<p>{escape(line)}</p>" for line in lines)


def send_admin_reply_email(
    *, to_email: str, to_name: str, subject: str, answer_text: str
):
    if not answer_text.strip():
        raise ValueError("answer_text is empty")
    return send_lead_reply_email(
        to_email=to_email,
        to_name=to_name,
        subject=subject,
        html_content=_answer_html(answer_text),
    )


@admin.action(description="Отправить ответ (Brevo)")
def send_article_question_reply(modeladmin, request, queryset):
    sent = skipped = failed = 0
    for question in queryset:
        if not question.answer_text.strip():
            skipped += 1
            continue
        subject = (
            f"Re: {question.article_title or question.article_slug or 'your question'}"
        )
        try:
            result = send_admin_reply_email(
                to_email=question.email,
                to_name=question.name,
                subject=subject,
                answer_text=question.answer_text,
            )
        except Exception as exc:
            failed += 1
            modeladmin.message_user(
                request,
                f"Question #{question.pk}: {exc}",
                level="error",
            )
            continue
        if result is None:
            skipped += 1
            continue
        question.answered = True
        question.answered_at = timezone.now()
        question.status = ArticleQuestion.Status.ANSWERED
        question.save(update_fields=["answered", "answered_at", "status"])
        sent += 1

    modeladmin.message_user(
        request,
        f"Questions: sent={sent}, skipped={skipped}, failed={failed}",
    )


@admin.action(description="Отправить ответ (Brevo)")
def send_contact_inquiry_reply(modeladmin, request, queryset):
    sent = skipped = failed = 0
    for inquiry in queryset:
        if not inquiry.answer_text.strip():
            skipped += 1
            continue
        subject = "Re: your inquiry"
        try:
            result = send_admin_reply_email(
                to_email=inquiry.email,
                to_name=inquiry.name,
                subject=subject,
                answer_text=inquiry.answer_text,
            )
        except Exception as exc:
            failed += 1
            modeladmin.message_user(
                request,
                f"Inquiry #{inquiry.pk}: {exc}",
                level="error",
            )
            continue
        if result is None:
            skipped += 1
            continue
        inquiry.answered = True
        inquiry.status = ContactInquiry.Status.REPLIED
        inquiry.save(update_fields=["answered", "status"])
        sent += 1

    modeladmin.message_user(
        request,
        f"Inquiries: sent={sent}, skipped={skipped}, failed={failed}",
    )


@admin.register(ArticleQuestion)
class ArticleQuestionAdmin(admin.ModelAdmin):
    actions = [send_article_question_reply]
    list_display = [
        "created_at",
        "name",
        "email",
        "article_title",
        "status",
        "answered",
        "subscribe_opt_in",
    ]
    list_filter = ["status", "answered", "subscribe_opt_in", "locale"]
    search_fields = ["name", "email", "article_title", "article_slug", "question"]
    readonly_fields = ["created_at", "ip_hash", "brevo_synced"]
    ordering = ["-created_at"]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "email",
                    "locale",
                    "post",
                    "article_slug",
                    "article_title",
                    "question",
                    "subscribe_opt_in",
                    "status",
                    "answered",
                    "answer_text",
                    "answered_at",
                    "brevo_synced",
                    "ip_hash",
                    "created_at",
                )
            },
        ),
    )


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    actions = [send_contact_inquiry_reply]
    list_display = [
        "created_at",
        "name",
        "email",
        "request_type",
        "status",
        "answered",
        "brevo_synced",
        "source_page",
    ]
    list_filter = ["status", "answered", "request_type", "locale"]
    search_fields = ["name", "email", "message", "source_page"]
    readonly_fields = ["created_at", "ip_hash", "brevo_synced"]
    ordering = ["-created_at"]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "email",
                    "locale",
                    "request_type",
                    "message",
                    "status",
                    "answered",
                    "answer_text",
                    "source_page",
                    "brevo_synced",
                    "ip_hash",
                    "created_at",
                )
            },
        ),
    )


@admin.register(SubscriberReference)
class SubscriberReferenceAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "locale",
        "newsletter",
        "doi_confirmed",
        "brevo_pending",
        "first_source",
        "updated_at",
    ]
    list_filter = [
        "newsletter",
        "doi_confirmed",
        "brevo_pending",
        "first_source",
        "locale",
    ]
    search_fields = ["email", "brevo_contact_id", "first_article_slug"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-updated_at"]


@admin.register(LeadEvent)
class LeadEventAdmin(admin.ModelAdmin):
    list_display = [
        "created_at",
        "event_type",
        "email",
        "locale",
        "page_path",
        "article_slug",
    ]
    list_filter = ["event_type", "locale"]
    search_fields = ["email", "page_path", "article_slug", "referrer", "utm_source"]
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]
