from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0046_gas_selection_solution_step_extra"),
    ]

    operations = [
        migrations.CreateModel(
            name="BookPageImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        help_text=(
                            "JPG/WebP, ~3:2 or 16:10, width 1600–2000 px recommended. "
                            "Up to ~8–12 images per book."
                        ),
                        upload_to="book/pages/",
                    ),
                ),
                ("order", models.PositiveIntegerField(default=0)),
                ("alt", models.CharField(blank=True, max_length=255)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "book",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="page_images",
                        to="pages.book",
                    ),
                ),
            ],
            options={
                "verbose_name": "Book page image",
                "verbose_name_plural": "Book page images",
                "db_table": "pages_book_page_images",
                "ordering": ["order", "id"],
            },
        ),
    ]
