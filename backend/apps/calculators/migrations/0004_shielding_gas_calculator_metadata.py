# flake8: noqa: E501
from django.db import migrations


SHIELDING_GAS_METADATA = {
    "name": "Shielding Gas Calculator",
    "description": "Five-step selection of shielding gas mixtures for MAG, MIG and TIG: material, process, thickness and ISO mix with criteria scores.",
    "name_en": "Shielding Gas Calculator",
    "description_en": "Five-step selection of shielding gas mixtures for MAG, MIG and TIG: material, process, thickness and ISO mix with criteria scores.",
    "name_ru": "Калькулятор защитного газа",
    "description_ru": "Пятишаговый подбор смесей защитного газа для MAG, MIG и TIG: материал, процесс, толщина и смесь по ISO с оценками по критериям.",
    "name_lv": "Aizsarggāzes kalkulators",
    "description_lv": "Piecu soļu aizsarggāzes maisījumu izvēle MAG, MIG un TIG: materiāls, process, biezums un ISO maisījums ar kritēriju vērtējumiem.",
}

LEGACY_SHIELDING_GAS_METADATA = {
    "name": "Shielding Gas Calculator",
    "description": "Recommended shielding gas flow by wire diameter",
    "name_en": "Shielding Gas Calculator",
    "description_en": "Recommended shielding gas flow by wire diameter",
    "name_ru": "",
    "description_ru": "",
    "name_lv": "",
    "description_lv": "",
}


def update_shielding_gas_metadata(apps, schema_editor):
    Calculator = apps.get_model("calculators", "Calculator")
    Calculator.objects.filter(slug="shielding-gas").update(**SHIELDING_GAS_METADATA)


def restore_legacy_shielding_gas_metadata(apps, schema_editor):
    Calculator = apps.get_model("calculators", "Calculator")
    Calculator.objects.filter(slug="shielding-gas").update(
        **LEGACY_SHIELDING_GAS_METADATA
    )


class Migration(migrations.Migration):

    dependencies = [
        ("calculators", "0003_multilingual_calculator_fields"),
    ]

    operations = [
        migrations.RunPython(
            update_shielding_gas_metadata,
            restore_legacy_shielding_gas_metadata,
        ),
    ]
