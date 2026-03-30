# -*- coding: utf-8 -*-
from django.db import migrations

BIO_RU = (
    "<p class='home-about-lead'>"
    "Инженер по сварке (IWE) с опытом преподавания</p>"
    "<p class='home-about-p'>Квалификация по TIG, MAG, MMA сварочным процессам, "
    "практическое владение газокислородной резкой, пайкой и термической правкой.</p>"
    "<p class='home-about-p'>Опыт в технологии сварки-сборки металлических "
    "конструкций с минимальными термическими деформациями и оптимизацией "
    "сварочных процессов.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>Оказываю экспертную помощь в "
    "выборе защитной газовой смеси при сварке MAG/MIG/TIG для повышения качества "
    "и стабильности процессов.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>Автор книги по MAG/MIG.</p>"
)

BIO_EN = (
    "<p class='home-about-lead'>"
    "Welding engineer (IWE) with teaching experience</p>"
    "<p class='home-about-p'>Qualifications in TIG, MAG, and MMA welding "
    "processes; practical skills in oxy-fuel cutting, soldering, brazing, "
    "and thermal straightening.</p>"
    "<p class='home-about-p'>Experience in welding and assembly of steel "
    "structures with minimal thermal distortion and optimization of welding "
    "processes.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>Expert support in selecting "
    "shielding gas mixtures for MAG, MIG, and TIG welding to improve quality "
    "and process stability.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>"
    "Author of a book on MAG/MIG welding.</p>"
)

BIO_LV = (
    "<p class='home-about-lead'>"
    "Metināšanas inženieris (IWE) ar pasniegšanas pieredzi</p>"
    "<p class='home-about-p'>Kvalifikācija TIG, MAG un MMA metināšanas procesos; "
    "praktiskās prasmes autogēnā griešanā, lodēšanā un termiskajā "
    "iztaisnošanā.</p>"
    "<p class='home-about-p'>Pieredze metāla konstrukciju metināšanas un montāžas "
    "tehnoloģijās ar minimālām termiskām deformācijām un metināšanas procesu "
    "optimizāciju.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>Eksperta atbalsts aizsarggāzu "
    "maisījumu izvēlē MAG, MIG un TIG metināšanai, lai paaugstinātu kvalitāti "
    "un procesa stabilitāti.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>"
    "Grāmatas par MAG/MIG metināšanu autors.</p>"
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
        ("pages", "0006_about_short_bio_update"),
    ]

    operations = [
        migrations.RunPython(update_bios, noop_reverse),
    ]
