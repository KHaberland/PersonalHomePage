from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0015_home_business_outcomes"),
    ]

    operations = [
        migrations.CreateModel(
            name="SiteTextBlock",
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
                    "page",
                    models.CharField(
                        choices=[
                            ("home", "Home"),
                            ("about", "About"),
                            ("experience", "Experience"),
                            ("expertise", "Expertise"),
                            ("solutions", "Solutions"),
                            ("knowledge", "Knowledge"),
                            ("tools", "Tools"),
                            ("contact", "Contact"),
                            ("book", "Book"),
                        ],
                        max_length=50,
                    ),
                ),
                ("block", models.SlugField(max_length=100)),
                ("key", models.SlugField(max_length=100)),
                ("text_en", models.TextField(blank=True)),
                ("text_ru", models.TextField(blank=True)),
                ("text_lv", models.TextField(blank=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Site text block",
                "verbose_name_plural": "Site text blocks",
                "db_table": "pages_site_text_blocks",
                "ordering": ["page", "block", "key"],
            },
        ),
        migrations.AddIndex(
            model_name="sitetextblock",
            index=models.Index(
                fields=["page", "block"],
                name="pages_site__page_de6101_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="sitetextblock",
            index=models.Index(
                fields=["page", "block", "key"],
                name="pages_site__page_00bb22_idx",
            ),
        ),
        migrations.AddConstraint(
            model_name="sitetextblock",
            constraint=models.UniqueConstraint(
                fields=("page", "block", "key"),
                name="unique_site_text_block_key",
            ),
        ),
    ]
