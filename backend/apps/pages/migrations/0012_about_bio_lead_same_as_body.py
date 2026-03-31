# -*- coding: utf-8 -*-
"""Первый абзац биографии — обычный текст (как остальные), без стиля lead."""

from django.db import migrations


def normalize_bio_lead(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if not row:
        return
    fields = ("bio_en", "bio_ru", "bio_lv")
    changed = False
    for name in fields:
        val = getattr(row, name) or ""
        if "class='home-about-lead'" in val:
            setattr(
                row,
                name,
                val.replace("class='home-about-lead'", "class='home-about-p'", 1),
            )
            changed = True
    if changed:
        row.save(update_fields=list(fields))


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0011_about_bio_narrative_2026"),
    ]

    operations = [
        migrations.RunPython(normalize_bio_lead, noop_reverse),
    ]
