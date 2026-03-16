# Generated data migration - initial calculators

from django.db import migrations


def create_initial_calculators(apps, schema_editor):
    Calculator = apps.get_model("calculators", "Calculator")
    calculators = [
        {
            "name": "Heat Input Calculator",
            "description": "Calculate heat input: Q = (U × I × 60) / (1000 × v) [kJ/mm]",
            "slug": "heat-input",
        },
        {
            "name": "Gas Flow Calculator",
            "description": "Calculate gas consumption and cylinder duration",
            "slug": "gas-flow",
        },
        {
            "name": "Shielding Gas Calculator",
            "description": "Recommended shielding gas flow by wire diameter",
            "slug": "shielding-gas",
        },
        {
            "name": "Gas Cutting Calculator",
            "description": "Gas cutting parameters by plate thickness",
            "slug": "gas-cutting",
        },
        {
            "name": "Welding Cost Calculator",
            "description": "Calculate welding cost: wire, gas, total",
            "slug": "welding-cost",
        },
        {
            "name": "Welding Parameters Calculator",
            "description": "Recommended welding parameters by thickness",
            "slug": "welding-parameters",
        },
    ]
    for calc in calculators:
        Calculator.objects.get_or_create(slug=calc["slug"], defaults=calc)


def reverse_calculators(apps, schema_editor):
    Calculator = apps.get_model("calculators", "Calculator")
    Calculator.objects.filter(
        slug__in=[
            "heat-input",
            "gas-flow",
            "shielding-gas",
            "gas-cutting",
            "welding-cost",
            "welding-parameters",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("calculators", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_initial_calculators, reverse_calculators),
    ]
