# -*- coding: utf-8 -*-
from django.db import migrations

EDUCATION_RU = (
    "<p>Степень бакалавра и магистра инженерных наук получена в Рижском техническом "
    "университете (RTU), Рига, Латвия.</p>"
    "<p>Специализация — технология приборостроения.</p>"
    "<p>Дополнительное обучение инженера по сварке:<br />"
    "Schweißtechnische Lehr- und Versuchsanstalt "
    "Mecklenburg-Vorpommern GmbH, Росток, Германия.</p>"
)

QUALIFICATIONS_RU = (
    "<p>Квалификация сварщика MMA/MAG — 3-я ремесленная школа, Рига, Латвия</p>"
    "<p>Квалификация сварщика TIG — учебный центр Buts, Рига, Латвия</p>"
    "<p>Уровень знаний International Welding Engineer (IWE)</p>"
)


def update_about_ru(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if row:
        row.bio_ru = ""
        row.education_ru = EDUCATION_RU
        row.qualifications_ru = QUALIFICATIONS_RU
        row.save(update_fields=["bio_ru", "education_ru", "qualifications_ru"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0003_clear_about_photo"),
    ]

    operations = [
        migrations.RunPython(update_about_ru, noop_reverse),
    ]
