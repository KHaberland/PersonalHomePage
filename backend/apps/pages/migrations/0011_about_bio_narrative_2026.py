# -*- coding: utf-8 -*-
from django.db import migrations

BIO_EN = (
    "<p class='home-about-p'>I am a welding engineer (IWE) with a practical "
    "background in production and teaching experience. I started my professional "
    "path in 2011 after completing MMA/MAG training.</p>"
    "<p class='home-about-p'>I gained hands-on experience across different "
    "industrial environments, including repair works, reinforcement production, "
    "and metal fabrication. This allowed me to understand real production "
    "conditions, as well as the gap between training and practical application.</p>"
    "<p class='home-about-p'>I later worked as a welding instructor for nearly "
    "three years, focusing on practical, production-oriented training.</p>"
    "<p class='home-about-p'>I currently work as a welding engineer, supporting "
    "production processes, advising on shielding gases and welding technologies, "
    "and improving welding quality and process stability.</p>"
    "<p class='home-about-p'>I am the author of a book on MAG/MIG welding.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>I hold Bachelor's and Master's "
    "degrees from Riga Technical University, completed additional training in "
    "welding engineering in Germany (SLV Rostock), and hold the International "
    "Welding Engineer (IWE) qualification.</p>"
)

BIO_RU = (
    "<p class='home-about-p'>Я инженер по сварке (IWE) с практическим опытом "
    "работы на производстве и преподавательской деятельностью. Мой профессиональный "
    "путь в сварке начался в 2011 году после обучения процессам MMA/MAG.</p>"
    "<p class='home-about-p'>Я получил практический опыт в различных производственных "
    "условиях, включая ремонтные работы, изготовление арматурных каркасов и "
    "металлоконструкций. Это позволило мне понять реальные условия производства и "
    "разницу между обучением и практикой.</p>"
    "<p class='home-about-p'>В дальнейшем я работал преподавателем сварки около "
    "трёх лет, делая акцент на практических навыках, применимых в производстве.</p>"
    "<p class='home-about-p'>В настоящее время я работаю инженером по сварке, "
    "сопровождаю производственные процессы, консультирую по выбору защитных газов "
    "и сварочных технологий, а также занимаюсь повышением качества и стабильности "
    "процессов.</p>"
    "<p class='home-about-p'>Я являюсь автором книги по сварке MAG/MIG.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>Имею степени бакалавра и магистра "
    "Рижского технического университета, прошёл дополнительное обучение по сварке "
    "в Германии (SLV Rostock) и обладаю квалификацией International Welding Engineer "
    "(IWE).</p>"
)

BIO_LV = (
    "<p class='home-about-p'>Es esmu metināšanas inženieris (IWE) ar praktisku "
    "pieredzi ražošanā un pasniegšanas pieredzi. Manu profesionālo ceļu metināšanā "
    "sāku 2011. gadā pēc MMA/MAG apmācības.</p>"
    "<p class='home-about-p'>Esmu guvis praktisku pieredzi dažādās ražošanas vidēs, "
    "tostarp remontdarbos, armatūras karkasu izgatavošanā un metālkonstrukciju "
    "ražošanā. Tas man ļāva izprast reālos ražošanas apstākļus un atšķirību starp "
    "apmācību un praksi.</p>"
    "<p class='home-about-p'>Vēlāk gandrīz trīs gadus strādāju par metināšanas "
    "pasniedzēju, koncentrējoties uz praktiskām, ražošanā pielietojamām prasmēm.</p>"
    "<p class='home-about-p'>Šobrīd strādāju kā metināšanas inženieris, atbalstu "
    "ražošanas procesus, konsultēju par aizsarggāzēm un metināšanas tehnoloģijām, kā "
    "arī uzlaboju metināšanas kvalitāti un procesu stabilitāti.</p>"
    "<p class='home-about-p'>Esmu grāmatas par MAG/MIG metināšanu autors.</p>"
    "<p class='home-about-p home-about-p--gap-lg'>Man ir bakalaura un maģistra grāds "
    "Rīgas Tehniskajā universitātē, esmu papildus apmācīts metināšanas inženierijā "
    "Vācijā (SLV Rostock) un man ir International Welding Engineer (IWE) "
    "kvalifikācija.</p>"
)


def update_about_content(apps, schema_editor):
    About = apps.get_model("pages", "About")
    row = About.objects.first()
    if not row:
        return
    row.bio_en = BIO_EN
    row.bio_ru = BIO_RU
    row.bio_lv = BIO_LV
    row.education_en = ""
    row.education_ru = ""
    row.education_lv = ""
    row.qualifications_en = ""
    row.qualifications_ru = ""
    row.qualifications_lv = ""
    row.save(
        update_fields=[
            "bio_en",
            "bio_ru",
            "bio_lv",
            "education_en",
            "education_ru",
            "education_lv",
            "qualifications_en",
            "qualifications_ru",
            "qualifications_lv",
        ]
    )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0010_about_bio_ru_lead_two_lines"),
    ]

    operations = [
        migrations.RunPython(update_about_content, noop_reverse),
    ]
