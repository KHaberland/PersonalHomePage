from django.db import migrations


OLD_LABEL = (
    "Expected direction",
    "Направление улучшения",
    "Uzlabojuma virziens",
)

NEW_LABEL = (
    "Result",
    "Результат",
    "Rezultāts",
)


def rename_expected_result_label(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="solutions",
        block="labels",
        key="expectedResult",
    ).update(
        text_en=NEW_LABEL[0],
        text_ru=NEW_LABEL[1],
        text_lv=NEW_LABEL[2],
    )


def restore_expected_result_label(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="solutions",
        block="labels",
        key="expectedResult",
    ).update(
        text_en=OLD_LABEL[0],
        text_ru=OLD_LABEL[1],
        text_lv=OLD_LABEL[2],
    )


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0050_migrate_solutions_site_text_to_models"),
    ]

    operations = [
        migrations.RunPython(
            rename_expected_result_label,
            restore_expected_result_label,
        ),
    ]
