# -*- coding: utf-8 -*-
"""Отдельная сущность для блока «Обо мне» на главной (About – Main)."""

from django.db import migrations, models


def seed_about_main_from_about(apps, schema_editor):
    About = apps.get_model("pages", "About")
    AboutMain = apps.get_model("pages", "AboutMain")
    if AboutMain.objects.exists():
        return
    about = About.objects.first()
    if about:
        AboutMain.objects.create(
            main_bio_en=about.bio_en or "",
            main_bio_ru=about.bio_ru or "",
            main_bio_lv=about.bio_lv or "",
        )
    else:
        AboutMain.objects.create(
            main_bio_en="",
            main_bio_ru="",
            main_bio_lv="",
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0012_about_bio_lead_same_as_body"),
    ]

    operations = [
        migrations.CreateModel(
            name="AboutMain",
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
                ("main_bio_en", models.TextField(blank=True)),
                ("main_bio_ru", models.TextField(blank=True)),
                ("main_bio_lv", models.TextField(blank=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "About – Main",
                "verbose_name_plural": "About – Main",
                "db_table": "pages_about_main",
            },
        ),
        migrations.RunPython(seed_about_main_from_about, noop_reverse),
    ]
