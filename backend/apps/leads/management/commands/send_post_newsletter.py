import logging

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.blog.models import Post
from apps.leads.services.newsletter import BrevoError, send_post_newsletter

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Send Brevo newsletter campaign for a published blog post."

    def add_arguments(self, parser):
        parser.add_argument("--slug", required=True, help="Post slug")
        parser.add_argument(
            "--locale",
            choices=["en", "ru", "lv", "all"],
            default="all",
            help="Target locale (default: all with content)",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Send even if already sent for this slug/locale",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview without calling Brevo",
        )

    def handle(self, *args, **options):
        slug = options["slug"]
        locale = options["locale"]
        force = options["force"]
        dry_run = options["dry_run"]

        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist as exc:
            raise CommandError(f"Post not found: {slug}") from exc

        locales = None if locale == "all" else [locale]

        try:
            results = send_post_newsletter(
                post,
                locales=locales,
                force=force,
                dry_run=dry_run,
            )
        except (BrevoError, ValueError) as exc:
            raise CommandError(str(exc)) from exc

        for item in results:
            self.stdout.write(f"{item['locale']}: {item['status']}")
            if item.get("campaign_id"):
                self.stdout.write(f"  campaign_id={item['campaign_id']}")
            if item.get("reason"):
                self.stdout.write(f"  reason={item['reason']}")

        if not dry_run and settings.BREVO_AUTO_SEND_ON_PUBLISH:
            logger.info(
                "Auto-send on publish is enabled via BREVO_AUTO_SEND_ON_PUBLISH"
            )
