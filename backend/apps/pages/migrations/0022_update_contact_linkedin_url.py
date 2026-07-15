from django.db import migrations


LINKEDIN_URL = "https://www.linkedin.com/oleg-suvorov-125639216"


def update_linkedin_url(apps, schema_editor):
    Contact = apps.get_model("pages", "Contact")
    Contact.objects.update(linkedin_url=LINKEDIN_URL)


def restore_linkedin_url(apps, schema_editor):
    Contact = apps.get_model("pages", "Contact")
    Contact.objects.update(linkedin_url="https://linkedin.com/in/olegsuvorov")


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0021_seo_metadata"),
    ]

    operations = [
        migrations.RunPython(update_linkedin_url, restore_linkedin_url),
    ]
