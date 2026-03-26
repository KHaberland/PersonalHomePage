# Очистка фото в About — на фронтенде статический /images/photos/small/Author_small.jpg

from django.db import migrations


def clear_about_photo(apps, schema_editor):
    About = apps.get_model("pages", "About")
    About.objects.update(photo=None)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0002_initial_content"),
    ]

    operations = [
        migrations.RunPython(clear_about_photo, noop_reverse),
    ]
