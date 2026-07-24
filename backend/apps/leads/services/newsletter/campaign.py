import logging
from html import escape

from django.conf import settings
from django.utils.html import strip_tags

from apps.blog.models import Post
from apps.leads.models import LeadEvent

from .brevo import BrevoError, BrevoProvider

logger = logging.getLogger(__name__)

LOCALES = ("en", "ru", "lv")


def _site_origin() -> str:
    if settings.CORS_ALLOWED_ORIGINS:
        return settings.CORS_ALLOWED_ORIGINS[0].strip().rstrip("/")
    return "http://localhost:3000"


def _segment_ids_for_locale(locale: str) -> list[int] | None:
    raw = settings.BREVO_NEWSLETTER_LOCALE_SEGMENTS.strip()
    if not raw:
        return None

    mapping = {}
    for part in raw.split(","):
        piece = part.strip()
        if not piece or ":" not in piece:
            continue
        key, value = piece.split(":", 1)
        try:
            mapping[key.strip()] = int(value.strip())
        except ValueError:
            continue

    segment_id = mapping.get(locale)
    return [segment_id] if segment_id is not None else None


def _post_field(post: Post, locale: str, field: str) -> str:
    localized = getattr(post, f"{field}_{locale}", "") or ""
    if localized.strip():
        return localized.strip()
    if locale != "en":
        return getattr(post, f"{field}_en", "") or ""
    return ""


def _article_url(post: Post, locale: str) -> str:
    return f"{_site_origin()}/{locale}/blog/{post.slug}"


def _build_html_campaign(post: Post, locale: str) -> tuple[str, str]:
    title = _post_field(post, locale, "title")
    excerpt = strip_tags(_post_field(post, locale, "excerpt"))[:500]
    url = _article_url(post, locale)

    subject = title
    html = (
        f"<p>{escape(_campaign_lead(locale))}</p>"
        f"<h2>{escape(title)}</h2>"
        f"<p>{escape(excerpt)}</p>"
        f'<p><a href="{escape(url)}">{escape(_read_more(locale))}</a></p>'
    )
    return subject, html


def _campaign_lead(locale: str) -> str:
    leads = {
        "en": "New article on the blog:",
        "ru": "Новая статья в блоге:",
        "lv": "Jauns raksts blogā:",
    }
    return leads.get(locale, leads["en"])


def _read_more(locale: str) -> str:
    labels = {
        "en": "Read more",
        "ru": "Читать статью",
        "lv": "Lasīt rakstu",
    }
    return labels.get(locale, labels["en"])


def _campaign_name(post: Post, locale: str) -> str:
    return f"blog-{post.slug}-{locale}-{post.updated_at:%Y%m%d%H%M%S}"


def _already_sent(post: Post, locale: str) -> bool:
    return LeadEvent.objects.filter(
        event_type=LeadEvent.EventType.ARTICLE_NEWSLETTER_SENT,
        article_slug=post.slug,
        locale=locale,
    ).exists()


def send_post_newsletter(
    post: Post,
    *,
    locales: list[str] | None = None,
    force: bool = False,
    dry_run: bool = False,
) -> list[dict]:
    if post.status != Post.Status.PUBLISHED:
        raise ValueError("Post must be published")

    provider = BrevoProvider()
    if not dry_run and not provider.is_campaign_configured():
        raise BrevoError("Brevo campaign is not configured")

    target_locales = locales or list(LOCALES)
    results: list[dict] = []

    template_raw = settings.BREVO_TEMPLATE_NEWSLETTER_ARTICLE.strip()
    template_id = int(template_raw) if template_raw else None

    for locale in target_locales:
        if locale not in LOCALES:
            continue

        title = _post_field(post, locale, "title")
        if not title:
            results.append(
                {"locale": locale, "status": "skipped", "reason": "no_title"}
            )
            continue

        if not force and _already_sent(post, locale):
            results.append(
                {"locale": locale, "status": "skipped", "reason": "already_sent"}
            )
            continue

        subject, html_content = _build_html_campaign(post, locale)
        params = {
            "ARTICLE_TITLE": title,
            "ARTICLE_EXCERPT": strip_tags(_post_field(post, locale, "excerpt"))[:500],
            "ARTICLE_URL": _article_url(post, locale),
            "ARTICLE_SLUG": post.slug,
            "LOCALE": locale,
        }
        segment_ids = _segment_ids_for_locale(locale)

        if dry_run:
            results.append(
                {
                    "locale": locale,
                    "status": "dry_run",
                    "subject": subject,
                    "segment_ids": segment_ids,
                }
            )
            continue

        campaign_id = provider.send_email_campaign(
            name=_campaign_name(post, locale),
            subject=subject,
            html_content=html_content if not template_id else "",
            template_id=template_id,
            params=params if template_id else None,
            segment_ids=segment_ids,
        )

        LeadEvent.objects.create(
            event_type=LeadEvent.EventType.ARTICLE_NEWSLETTER_SENT,
            locale=locale,
            article_slug=post.slug,
            page_path=f"/{locale}/blog/{post.slug}",
            metadata={
                "campaign_id": campaign_id,
                "subject": subject,
                "segment_ids": segment_ids or [],
            },
        )

        if segment_ids is None:
            logger.warning(
                "Newsletter for %s (%s) sent to full list; "
                "configure BREVO_NEWSLETTER_LOCALE_SEGMENTS for locale targeting",
                post.slug,
                locale,
            )

        results.append({"locale": locale, "status": "sent", "campaign_id": campaign_id})

    return results
