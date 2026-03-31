# -*- coding: utf-8 -*-
from django.db import migrations

LEAD_ONE_LINE = (
    "<p class='home-about-lead'>"
    "Инженер по сварке (IWE) с опытом преподавания и автор книги по MAG/MIG.</p>"
)
LEAD_TWO_LINES = (
    "<p class='home-about-lead'>"
    "Инженер по сварке (IWE) с опытом преподавания<br />"
    "и автор книги по MAG/MIG.</p>"
)


def split_ru_lead(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if not row or not row.bio_ru:
        return
    if LEAD_TWO_LINES in row.bio_ru or "<br />" in row.bio_ru.split("</p>", 1)[0]:
        return
    if LEAD_ONE_LINE in row.bio_ru:
        row.bio_ru = row.bio_ru.replace(LEAD_ONE_LINE, LEAD_TWO_LINES, 1)
        row.save(update_fields=["bio_ru"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0009_about_bio_merge_author_lead"),
    ]

    operations = [
        migrations.RunPython(split_ru_lead, noop_reverse),
    ]
