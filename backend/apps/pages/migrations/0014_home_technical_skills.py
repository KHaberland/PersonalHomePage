from django.db import migrations, models


def seed_home_technical_skills(apps, schema_editor):
    Intro = apps.get_model("pages", "HomeTechnicalSkillsIntro")
    Card = apps.get_model("pages", "HomeTechnicalSkillCard")
    if Intro.objects.exists():
        return
    Intro.objects.create(
        lead_en="Processes, equipment, and materials — the engineering depth behind the work.",
        lead_ru="Процессы, оборудование и материалы — инженерная база компетенций.",
        lead_lv="Procesi, iekārtas un materiāli — inženieru kompetences pamats.",
    )
    rows = [
        (
            1,
            "MIG/MAG welding",
            "MIG/MAG сварка",
            "MIG/MAG metināšana",
            "Development and documentation of pWPS/WPS, quality control and process optimization",
            "разработка и оформление pWPS/WPS, контроль качества и оптимизация процессов",
            "pWPS/WPS izstrāde un noformēšana, kvalitātes kontrole un procesu optimizācija",
        ),
        (
            2,
            "TIG aluminum / stainless steel welding",
            "TIG сварка алюминия / нержавеющей стали",
            "TIG metināšana alumīnijam / nerūsējošajam tēraudam",
            "mode optimization and defect reduction",
            "оптимизация режимов и снижение брака",
            "režīmu optimizācija un brāķa samazināšana",
        ),
        (
            3,
            "Shielding gases for MIG/MAG/TIG",
            "Защитные газы для MIG/MAG/TIG",
            "Aizsarggāzes MIG/MAG/TIG",
            "Gas mixture selection and consumption optimization",
            "Подбор газовых смесей и оптимизация расхода",
            "Gāzu maisījumu izvēle un patēriņa optimizācija",
        ),
        (
            4,
            "Gas safety",
            "Техника безопасности с газами",
            "Drošība ar gāzēm",
            "Staff training, process control, and risk reduction",
            "обучение персонала, контроль процессов и снижение рисков",
            "Personāla apmācība, procesu kontrole un riska samazināšana",
        ),
        (
            5,
            "Welding metallurgy",
            "Металлургия сварки",
            "Metināšanas metalurģija",
            "defects, heat input, weld quality control",
            "дефекты, тепловложение, контроль качества шва",
            "defekti, siltuma ievade, šuves kvalitātes kontrole",
        ),
        (
            6,
            "Cutting gases",
            "Газы для резки",
            "Gāzes griešanai",
            "Optimal fuel gas selection and cutting parameter setup",
            "Оптимальный выбор горючего газа и настройка параметров резки",
            "Optimāla degvielas gāzes izvēle un griešanas parametru iestatīšana",
        ),
    ]
    for (
        order,
        title_en,
        title_ru,
        title_lv,
        description_en,
        description_ru,
        description_lv,
    ) in rows:
        Card.objects.create(
            order=order,
            title_en=title_en,
            title_ru=title_ru,
            title_lv=title_lv,
            description_en=description_en,
            description_ru=description_ru,
            description_lv=description_lv,
        )


def unseed_home_technical_skills(apps, schema_editor):
    Card = apps.get_model("pages", "HomeTechnicalSkillCard")
    Intro = apps.get_model("pages", "HomeTechnicalSkillsIntro")
    Card.objects.all().delete()
    Intro.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0013_about_main"),
    ]

    operations = [
        migrations.CreateModel(
            name="HomeTechnicalSkillsIntro",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("lead_en", models.TextField(blank=True)),
                ("lead_ru", models.TextField(blank=True)),
                ("lead_lv", models.TextField(blank=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Home – Technical skills (lead)",
                "verbose_name_plural": "Home – Technical skills (lead)",
                "db_table": "pages_home_technical_skills_intro",
            },
        ),
        migrations.CreateModel(
            name="HomeTechnicalSkillCard",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("order", models.PositiveSmallIntegerField(unique=True)),
                ("title_en", models.CharField(max_length=500)),
                ("title_ru", models.CharField(blank=True, max_length=500)),
                ("title_lv", models.CharField(blank=True, max_length=500)),
                ("description_en", models.TextField(blank=True)),
                ("description_ru", models.TextField(blank=True)),
                ("description_lv", models.TextField(blank=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Home – Technical skill card",
                "verbose_name_plural": "Home – Technical skill cards",
                "db_table": "pages_home_technical_skill_card",
                "ordering": ["order"],
            },
        ),
        migrations.RunPython(seed_home_technical_skills, unseed_home_technical_skills),
    ]
