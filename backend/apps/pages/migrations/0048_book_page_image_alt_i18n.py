from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0047_book_page_image"),
    ]

    operations = [
        migrations.RenameField(
            model_name="bookpageimage",
            old_name="alt",
            new_name="alt_en",
        ),
        migrations.AddField(
            model_name="bookpageimage",
            name="alt_ru",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="bookpageimage",
            name="alt_lv",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name="bookpageimage",
            name="image",
            field=models.ImageField(
                help_text=(
                    "JPG/WebP, ~3:2 or 16:10, width 1600–2000 px recommended. "
                    "Up to 12 images per book, max 5 MB each."
                ),
                upload_to="book/pages/",
            ),
        ),
    ]
