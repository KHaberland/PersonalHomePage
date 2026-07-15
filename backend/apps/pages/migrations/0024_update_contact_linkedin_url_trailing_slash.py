from django.db import migrations


LINKEDIN_URL = "https://www.linkedin.com/in/oleg-suvorov-125639216/"
PREVIOUS_LINKEDIN_URL = "https://www.linkedin.com//in/oleg-suvorov-125639216"


def update_linkedin_url(apps, schema_editor):
    Contact = apps.get_model("pages", "Contact")
    Contact.objects.update(linkedin_url=LINKEDIN_URL)


def restore_linkedin_url(apps, schema_editor):
    Contact = apps.get_model("pages", "Contact")
    Contact.objects.update(linkedin_url=PREVIOUS_LINKEDIN_URL)


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0023_update_contact_linkedin_url_path"),
    ]

    operations = [
        migrations.RunPython(update_linkedin_url, restore_linkedin_url),
    ]
