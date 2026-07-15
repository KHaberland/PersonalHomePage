# flake8: noqa: E501
from django.db import migrations


ABOUT_TEASER_BLOCKS = [
    (
        "aboutTeaserAriaLabel",
        "About the engineer behind the system",
        "Об инженере за системой",
        "Par inženieri aiz sistēmas",
    ),
    (
        "aboutTeaserPhotoAlt",
        "Oleg Suvorov in a welding production context",
        "Олег Суворов в производственном сварочном контексте",
        "Olegs Suvorovs metināšanas ražošanas vidē",
    ),
    (
        "aboutTeaserTitle",
        "Industrial welding engineer working in production environments",
        "Industrial welding engineer working in production environments",
        "Industrial welding engineer working in production environments",
    ),
    (
        "aboutTeaserLead1",
        "I work directly with real welding production challenges — troubleshooting instability, improving process repeatability, and aligning workshop practice with technical requirements.",
        "Я работаю с реальными производственными задачами в сварке: разбираю нестабильное поведение процесса, повышаю повторяемость работы и связываю практику цеха с техническими требованиями.",
        "Es strādāju ar reāliem metināšanas ražošanas izaicinājumiem: analizēju nestabilu procesu uzvedību, uzlaboju darba atkārtojamību un sasaistu ceha praksi ar tehniskajām prasībām.",
    ),
    (
        "aboutTeaserLead2",
        "My focus is on practical engineering decisions that make welding processes more predictable, controllable, and suitable for industrial constraints.",
        "Мой фокус — практические инженерные решения, которые делают сварочные процессы более предсказуемыми, управляемыми и пригодными для промышленных ограничений.",
        "Mans fokuss ir praktiski inženiertehniski lēmumi, kas padara metināšanas procesus paredzamākus, kontrolējamākus un piemērotus rūpnieciskajiem ierobežojumiem.",
    ),
    (
        "aboutTeaserBulletProduction",
        "Hands-on experience in industrial production environments",
        "Практический опыт в промышленных производственных условиях",
        "Praktiska pieredze rūpnieciskā ražošanas vidē",
    ),
    (
        "aboutTeaserBulletTroubleshooting",
        "Welding process troubleshooting and stabilization",
        "Разбор и стабилизация сварочного процесса",
        "Metināšanas procesa problēmu analīze un stabilizēšana",
    ),
    (
        "aboutTeaserBulletTeams",
        "Engineering support for operators and production teams",
        "Инженерная поддержка операторов и производственных команд",
        "Inženiertehnisks atbalsts operatoriem un ražošanas komandām",
    ),
    (
        "aboutTeaserBulletRequirements",
        "Connection between workshop practice and technical requirements",
        "Связь между практикой цеха и техническими требованиями",
        "Saikne starp ceha praksi un tehniskajām prasībām",
    ),
    ("aboutTeaserAboutCta", "About me", "Обо мне", "Par mani"),
    ("aboutTeaserExperienceCta", "Experience", "Опыт", "Pieredze"),
]


def seed_home_about_teaser(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in ABOUT_TEASER_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="home",
            block="about_teaser",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_home_about_teaser(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="home",
        block="about_teaser",
        key__in=[key for key, *_ in ABOUT_TEASER_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0024_update_contact_linkedin_url_trailing_slash"),
    ]

    operations = [
        migrations.RunPython(seed_home_about_teaser, remove_home_about_teaser),
    ]
