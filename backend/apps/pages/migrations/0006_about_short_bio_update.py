# -*- coding: utf-8 -*-
from django.db import migrations

BIO_RU = (
    "<p>Инженер по сварке (IWE) с практическим опытом и преподавания. "
    "Провожу курсы по материаловедению сталей и технологии сварки, "
    "включая практические занятия.</p>"
    "<p>Практический опыт сварщика позволяет глубоко понимать производственные "
    "процессы и оптимизировать работу дуги, плавление металла и перенос "
    "присадочного материала.</p>"
    "<p>Автор книги по сварке MAG/MIG.</p>"
)

BIO_EN = (
    "<p>Welding engineer (IWE) with hands-on experience and teaching. "
    "I teach courses in steel materials science and welding technology, "
    "including practical sessions.</p>"
    "<p>Hands-on experience as a welder enables a deep understanding of "
    "production processes and helps optimize arc behavior, metal melting, "
    "and filler metal transfer.</p>"
    "<p>Author of a book on MAG/MIG welding.</p>"
)

BIO_LV = (
    "<p>Metināšanas inženieris (IWE) ar praktisko pieredzi un pasniegšanas "
    "pieredzi. Vadu kursus par tēraudu materiālzinātni un metināšanas "
    "tehnoloģiju, ieskaitot praktiskās nodarbības.</p>"
    "<p>Praktiskā pieredze kā metinātājam ļauj dziļi saprast ražošanas "
    "procesus un optimizēt loka darbību, metāla kausēšanu un piedevas "
    "materiāla pārnesi.</p>"
    "<p>Grāmatas par MAG/MIG metināšanu autors.</p>"
)


def update_bios(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if row:
        row.bio_ru = BIO_RU
        row.bio_en = BIO_EN
        row.bio_lv = BIO_LV
        row.save(update_fields=["bio_ru", "bio_en", "bio_lv"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0005_about_ru_specialization_qualifications"),
    ]

    operations = [
        migrations.RunPython(update_bios, noop_reverse),
    ]
