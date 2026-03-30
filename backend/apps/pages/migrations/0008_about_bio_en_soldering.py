# -*- coding: utf-8 -*-
from django.db import migrations


def patch_bio_en(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if not row or not row.bio_en:
        return
    if "soldering, brazing" in row.bio_en:
        return
    row.bio_en = row.bio_en.replace(
        "oxy-fuel cutting, brazing, and thermal straightening",
        "oxy-fuel cutting, soldering, brazing, and thermal straightening",
    )
    row.save(update_fields=["bio_en"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0007_about_bio_home_typography"),
    ]

    operations = [
        migrations.RunPython(patch_bio_en, noop_reverse),
    ]
