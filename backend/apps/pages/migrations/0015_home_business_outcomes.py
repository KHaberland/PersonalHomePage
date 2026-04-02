from django.db import migrations, models


def seed_home_business_outcomes(apps, schema_editor):
    Intro = apps.get_model("pages", "HomeBusinessOutcomesIntro")
    Card = apps.get_model("pages", "HomeBusinessOutcomeCard")
    if Intro.objects.exists():
        return
    Intro.objects.create(
        subtitle_en="Business outcomes",
        subtitle_ru="Результаты для бизнеса",
        subtitle_lv="Uzņēmuma rezultāti",
        lead_en=(
            "Measurable impact: lower costs, fewer defects, "
            "and stronger welding performance."
        ),
        lead_ru="Измеримый эффект: KPI, затраты и устойчивые навыки команды.",
        lead_lv="Mērjams rezultāts: KPI, izmaksas un komandas sagatavotība.",
    )
    rows = [
        (
            1,
            "Cost and quality KPIs",
            "Качество и затраты (KPI)",
            "Kvalitāte un izmaksas (KPI)",
            (
                "Lower defect rates, reduced consumable costs, "
                "and clear cost per meter in production."
            ),
            (
                "Снижение брака и расхода, прозрачная себестоимость "
                "на метр и на проект."
            ),
            "Mazāk brāķa un patēriņa, skaidras izmaksas uz metru un projektu.",
        ),
        (
            2,
            "Team capability",
            "Сильная команда",
            "Komandas spējas",
            (
                "Training systems for welders and supervisors that improve "
                "real production performance."
            ),
            (
                "Обучение сварщиков и руководителей — навыки, "
                "которые закрепляются в цеху."
            ),
            "Metinātāju un vadītāju apmācība — prasmes, kas nostiprinās cehā.",
        ),
        (
            3,
            "Process assurance",
            "Процессы и документация",
            "Procesi un dokumentācija",
            (
                "Support for audits and tenders with stable welding "
                "procedures, documentation, and reduced compliance risks."
            ),
            (
                "Поддержка при аудитах и тендерах, стабильные процедуры "
                "сварки и прослеживаемость."
            ),
            (
                "Atbalsts auditos un tenderos, stabili metināšanas procesi "
                "un izsekojamība."
            ),
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


def unseed_home_business_outcomes(apps, schema_editor):
    Card = apps.get_model("pages", "HomeBusinessOutcomeCard")
    Intro = apps.get_model("pages", "HomeBusinessOutcomesIntro")
    Card.objects.all().delete()
    Intro.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0014_home_technical_skills"),
    ]

    operations = [
        migrations.CreateModel(
            name="HomeBusinessOutcomesIntro",
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
                ("subtitle_en", models.CharField(blank=True, max_length=500)),
                ("subtitle_ru", models.CharField(blank=True, max_length=500)),
                ("subtitle_lv", models.CharField(blank=True, max_length=500)),
                ("lead_en", models.TextField(blank=True)),
                ("lead_ru", models.TextField(blank=True)),
                ("lead_lv", models.TextField(blank=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Home – Business outcomes (intro)",
                "verbose_name_plural": "Home – Business outcomes (intro)",
                "db_table": "pages_home_business_outcomes_intro",
            },
        ),
        migrations.CreateModel(
            name="HomeBusinessOutcomeCard",
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
                "verbose_name": "Home – Business outcome card",
                "verbose_name_plural": "Home – Business outcome cards",
                "db_table": "pages_home_business_outcome_card",
                "ordering": ["order"],
            },
        ),
        migrations.RunPython(
            seed_home_business_outcomes, unseed_home_business_outcomes
        ),
    ]
