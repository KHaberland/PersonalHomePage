from django.db import migrations, models


def copy_legacy_calculator_text(apps, schema_editor):
    Calculator = apps.get_model("calculators", "Calculator")
    for calculator in Calculator.objects.all():
        calculator.name_en = calculator.name
        calculator.description_en = calculator.description
        calculator.save(update_fields=["name_en", "description_en"])


def clear_copied_calculator_text(apps, schema_editor):
    Calculator = apps.get_model("calculators", "Calculator")
    Calculator.objects.update(name_en="", description_en="")


class Migration(migrations.Migration):

    dependencies = [
        ("calculators", "0002_initial_calculators"),
    ]

    operations = [
        migrations.AddField(
            model_name="calculator",
            name="description_en",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="calculator",
            name="description_lv",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="calculator",
            name="description_ru",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="calculator",
            name="name_en",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="calculator",
            name="name_lv",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="calculator",
            name="name_ru",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.RunPython(
            copy_legacy_calculator_text,
            clear_copied_calculator_text,
        ),
    ]
