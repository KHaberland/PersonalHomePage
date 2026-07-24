import logging

from django.conf import settings
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.blog.models import Post
from apps.leads.services.newsletter import BrevoError, send_post_newsletter

logger = logging.getLogger(__name__)


def _auto_send_enabled() -> bool:
    return settings.BREVO_AUTO_SEND_ON_PUBLISH.lower() in ("true", "1", "yes")


@receiver(post_save, sender=Post)
def auto_send_post_newsletter(sender, instance: Post, **kwargs):
    if not _auto_send_enabled():
        return
    if instance.status != Post.Status.PUBLISHED:
        return

    def _send():
        try:
            results = send_post_newsletter(instance)
        except (BrevoError, ValueError) as exc:
            logger.exception("Auto newsletter failed for %s: %s", instance.slug, exc)
            return

        sent = [item for item in results if item.get("status") == "sent"]
        if sent:
            logger.info(
                "Auto newsletter sent for %s: %s",
                instance.slug,
                ", ".join(item["locale"] for item in sent),
            )

    transaction.on_commit(_send)
