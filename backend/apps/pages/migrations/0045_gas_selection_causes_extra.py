# flake8: noqa: E501
from django.db import migrations


GAS_SELECTION_CAUSES = [
    (
        "causes_1",
        "The effect of the gas mix on arc stability, metal transfer, heat input, and weld appearance is not taken into account.",
        "Не учитывается влияние газовой смеси на стабильность дуги, перенос металла, тепловложение и внешний вид сварного шва.",
        "Gāzu maisījuma ietekme uz loka stabilitāti, metāla pārnesi, siltuma ievadi un metināšanas šuves izskatu netiek ņemta vērā.",
    ),
    (
        "causes_2",
        "Shielding effectiveness depends on shop conditions: drafts, access to the joint, welding position, and equipment settings.",
        "Эффективность газовой защиты зависит от условий производства: сквозняков, доступа к сварному соединению, положения сварки и настроек оборудования.",
        "Aizsardzības efektivitāte ir atkarīga no ražošanas apstākļiem: caurvēja, piekļuves metināšanas savienojumam, metināšanas pozīcijas un iekārtas iestatījumiem.",
    ),
    (
        "causes_3",
        "Gas flow, nozzle setup, and electrode stickout are not aligned with the material, process, and weld quality requirements at the workplace.",
        "Расход газа, конфигурация сопла и вылет электрода не согласованы с материалом, процессом и требованиями к качеству шва на рабочем месте.",
        "Gāzes plūsma, sprauslas konfigurācija un elektroda izvirzījums nav saskaņoti ar materiālu, procesu un šuves kvalitātes prasībām darba vietā.",
    ),
]

PREVIOUS_CAUSES = [
    (
        "causes_1",
        "Gas mixture, flow, nozzle, or electrode stickout does not match the material and shielding conditions.",
        "Газовая смесь, расход, сопло или вылет электрода не соответствуют материалу и условиям защиты.",
        "Gāzu maisījums, plūsma, sprausla vai elektroda izvirzījums neatbilst materiālam un aizsardzības apstākļiem.",
    ),
    (
        "causes_2",
        "Drafts, joint access, welding position, or equipment settings affect shielding.",
        "На защиту влияют сквозняки, доступ к шву, положение сварки или настройки оборудования.",
        "Aizsardzību ietekmē caurvējš, piekļuve šuvei, metināšanas pozīcija vai iekārtas iestatījumi.",
    ),
]


def seed_gas_selection_causes(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in GAS_SELECTION_CAUSES:
        SiteTextBlock.objects.update_or_create(
            page="solutions",
            block="section_gasSelection",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def revert_gas_selection_causes(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in PREVIOUS_CAUSES:
        SiteTextBlock.objects.update_or_create(
            page="solutions",
            block="section_gasSelection",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )
    SiteTextBlock.objects.filter(
        page="solutions",
        block="section_gasSelection",
        key="causes_3",
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0044_legal_privacy_gdpr_and_cookie_policy"),
    ]

    operations = [
        migrations.RunPython(seed_gas_selection_causes, revert_gas_selection_causes),
    ]
