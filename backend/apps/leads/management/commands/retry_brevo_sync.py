from django.core.management.base import BaseCommand

from apps.leads.services.newsletter.retry import retry_pending_brevo_syncs


class Command(BaseCommand):
    help = "Retry pending Brevo syncs (DOI, question/inquiry notify)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=50,
            help="Max records to process per run (default: 50).",
        )

    def handle(self, *args, **options):
        limit = options["limit"]
        results = retry_pending_brevo_syncs(limit=limit)

        if not results:
            self.stdout.write("No pending Brevo syncs.")
            return

        sent = sum(1 for item in results if item["status"] == "sent")
        failed = sum(1 for item in results if item["status"] == "failed")
        skipped = sum(1 for item in results if item["status"] == "skipped")

        self.stdout.write(
            self.style.SUCCESS(
                f"Processed {len(results)} item(s): "
                f"sent={sent}, failed={failed}, skipped={skipped}"
            )
        )

        for item in results:
            if item["status"] == "failed":
                self.stdout.write(
                    self.style.WARNING(
                        f"  {item['kind']} #{item['id']}: {item.get('error', 'failed')}"
                    )
                )
