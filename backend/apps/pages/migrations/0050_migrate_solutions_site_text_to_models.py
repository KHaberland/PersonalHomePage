# flake8: noqa: E501
from django.db import migrations

SECTIONS = [
    ("defectReduction", 0),
    ("processOptimization", 1),
    ("gasSelection", 2),
    ("training", 3),
    ("wpsSupport", 4),
]

COLUMNS = [
    ("problem", "problems"),
    ("cause", "causes"),
    ("analysis", "analysisItems"),
    ("solution", "solutionSteps"),
    ("result", "expectedResults"),
]


def _has_text(text_en, text_ru, text_lv):
    return bool(
        (text_en or "").strip() or (text_ru or "").strip() or (text_lv or "").strip()
    )


def migrate_solutions_from_site_text(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SolutionSection = apps.get_model("pages", "SolutionSection")
    SolutionColumnGroup = apps.get_model("pages", "SolutionColumnGroup")
    SolutionBullet = apps.get_model("pages", "SolutionBullet")

    if SolutionSection.objects.exists():
        return

    for item_key, order in SECTIONS:
        block = f"section_{item_key}"

        title_block = SiteTextBlock.objects.filter(
            page="solutions",
            block=block,
            key="title",
        ).first()

        section = SolutionSection.objects.create(
            item_key=item_key,
            order=order,
            title_en=title_block.text_en if title_block else "",
            title_ru=title_block.text_ru if title_block else "",
            title_lv=title_block.text_lv if title_block else "",
        )

        section_blocks = SiteTextBlock.objects.filter(
            page="solutions",
            block=block,
        ).exclude(key="title")

        for column, prefix in COLUMNS:
            group = SolutionColumnGroup.objects.create(
                section=section,
                column=column,
            )

            matching = []
            prefix_with_sep = f"{prefix}_"
            for text_block in section_blocks:
                key = text_block.key
                if not key.startswith(prefix_with_sep):
                    continue
                suffix = key[len(prefix_with_sep) :]
                if suffix.isdigit():
                    matching.append((int(suffix), text_block))

            matching.sort(key=lambda item: item[0])

            for bullet_order, text_block in matching:
                if not _has_text(
                    text_block.text_en,
                    text_block.text_ru,
                    text_block.text_lv,
                ):
                    continue
                SolutionBullet.objects.create(
                    group=group,
                    order=bullet_order,
                    text_en=text_block.text_en or "",
                    text_ru=text_block.text_ru or "",
                    text_lv=text_block.text_lv or "",
                )


def revert_solutions_from_site_text(apps, schema_editor):
    SolutionSection = apps.get_model("pages", "SolutionSection")
    SolutionSection.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0049_solutionsection_solutioncolumngroup_solutionbullet_and_more"),
    ]

    operations = [
        migrations.RunPython(
            migrate_solutions_from_site_text,
            revert_solutions_from_site_text,
        ),
    ]
