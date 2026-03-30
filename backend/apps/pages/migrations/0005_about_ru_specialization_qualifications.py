# -*- coding: utf-8 -*-
from django.db import migrations

OLD_SPEC = "<p>Специализация — технология сварки.</p>"
NEW_SPEC = "<p>Специализация — технология приборостроения.</p>"
OLD_QUAL_PARA = "<p>Квалификация инструктора по сварке</p>"


def patch_about_ru(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if not row or not row.education_ru:
        return
    edu = row.education_ru.replace(OLD_SPEC, NEW_SPEC)
    qual = row.qualifications_ru or ""
    if OLD_QUAL_PARA in qual:
        qual = qual.replace(OLD_QUAL_PARA, "")
    row.education_ru = edu
    row.qualifications_ru = qual
    row.save(update_fields=["education_ru", "qualifications_ru"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0004_about_ru_text_update"),
    ]

    operations = [
        migrations.RunPython(patch_about_ru, noop_reverse),
    ]
