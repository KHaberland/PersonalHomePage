# Generated data migration - initial content for About, Experience, Book, Contact

from django.db import migrations


def create_initial_content(apps, schema_editor):
    About = apps.get_model("pages", "About")
    Experience = apps.get_model("pages", "Experience")
    Book = apps.get_model("pages", "Book")
    Contact = apps.get_model("pages", "Contact")

    # About
    if not About.objects.exists():
        About.objects.create(
            bio_en='Welding engineer with extensive experience in MIG/MAG, TIG, and MMA processes. Expert in shielding gases and welding equipment. Author of the book "MAG/MIG welding". More than 10 years in the industry.',
            bio_ru="Инженер по сварке с большим опытом в процессах MIG/MAG, TIG и MMA. Эксперт по защитным газам и сварочному оборудованию. Автор книги «Сварка MAG/MIG». Более 10 лет в отрасли.",
            bio_lv='Metināšanas inženieris ar plašu pieredzi MIG/MAG, TIG un MMA procesos. Eksperts aizsarggāzēs un metināšanas iekārtās. Grāmatas "MAG/MIG metināšana" autors. Vairāk nekā 10 gadu nozarē.',
            education_en="Bachelor and Master degrees from RTU (Riga Technical University). Specialization in welding technology.",
            education_ru="Бакалавр и магистр РТУ (Рижский технический университет). Специализация — технология сварки.",
            education_lv="Bakalaura un maģistra grādi RTU (Rīgas Tehniskā universitāte). Specializācija — metināšanas tehnoloģija.",
            qualifications_en="Certified in MMA/MAG and TIG welding. Welding instructor qualification. International Welding Engineer (IWE) level knowledge.",
            qualifications_ru="Сертификаты по сварке MMA/MAG и TIG. Квалификация инструктора по сварке. Знания уровня International Welding Engineer (IWE).",
            qualifications_lv="Sertificēts MMA/MAG un TIG metināšanā. Metināšanas instruktora kvalifikācija. Starptautiskā metināšanas inženiera (IWE) līmeņa zināšanas.",
        )

    # Experience
    if not Experience.objects.exists():
        Experience.objects.bulk_create(
            [
                Experience(
                    title_en="Welding Engineer",
                    title_ru="Инженер по сварке",
                    title_lv="Metināšanas inženieris",
                    company_en="Elme Messer Gaas",
                    company_ru="Elme Messer Gaas",
                    company_lv="Elme Messer Gaas",
                    description_en="Technical support for welding processes, shielding gas selection, equipment optimization. Training and consulting.",
                    description_ru="Техническая поддержка сварочных процессов, подбор защитных газов, оптимизация оборудования. Обучение и консультирование.",
                    description_lv="Tehniskā atbalsts metināšanas procesiem, aizsarggāzu izvēle, iekārtu optimizācija. Apmācības un konsultācijas.",
                    start_year=2015,
                    end_year=None,
                    order=10,
                ),
                Experience(
                    title_en="Welding instructor",
                    title_ru="Инструктор по сварке",
                    title_lv="Metināšanas instruktors",
                    company_en="BUTS training center",
                    company_ru="Учебный центр BUTS",
                    company_lv="BUTS apmācības centrs",
                    description_en="Teaching welding techniques, preparing welders for certification.",
                    description_ru="Обучение техникам сварки, подготовка сварщиков к сертификации.",
                    description_lv="Metināšanas paņēmienu mācīšana, metinātāju sagatavošana sertifikācijai.",
                    start_year=2013,
                    end_year=2015,
                    order=5,
                ),
                Experience(
                    title_en="Welder",
                    title_ru="Сварщик",
                    title_lv="Metinātājs",
                    company_en="Production experience",
                    company_ru="Производственный опыт",
                    company_lv="Ražošanas pieredze",
                    description_en="Hands-on welding experience in production environment.",
                    description_ru="Практический опыт сварки в производственной среде.",
                    description_lv="Praktiska metināšanas pieredze ražošanas vidē.",
                    start_year=2008,
                    end_year=2013,
                    order=1,
                ),
            ]
        )

    # Book
    if not Book.objects.exists():
        Book.objects.create(
            title_en="MAG/MIG welding",
            title_ru="Сварка MAG/MIG",
            title_lv="MAG/MIG metināšana",
            description_en="A comprehensive guide to MAG/MIG welding: from choosing the right equipment and shielding gas to mastering welding techniques. Written by a practicing welding engineer with years of experience.",
            description_ru="Подробное руководство по сварке MAG/MIG: от выбора оборудования и защитного газа до освоения методов сварки. Написано практикующим инженером по сварке с многолетним опытом.",
            description_lv="Pilnīga rokasgrāmata MAG/MIG metināšanai: no pareizās iekārtas un aizsarggāzes izvēles līdz metināšanas paņēmienu apgūšanai. Rakstīta praktizējoša metināšanas inženiera ar daudzu gadu pieredzi.",
            year=2024,
        )

    # Contact
    if not Contact.objects.exists():
        Contact.objects.create(
            email="contact@example.com",
            linkedin_url="https://linkedin.com/in/olegsuvorov",
            youtube_url="https://youtube.com/@olegsuvorov",
        )


def reverse_content(apps, schema_editor):
    About = apps.get_model("pages", "About")
    Experience = apps.get_model("pages", "Experience")
    Book = apps.get_model("pages", "Book")
    Contact = apps.get_model("pages", "Contact")
    About.objects.all().delete()
    Experience.objects.all().delete()
    Book.objects.all().delete()
    Contact.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_initial_content, reverse_content),
    ]
