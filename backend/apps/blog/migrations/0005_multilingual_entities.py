import django.db.models.deletion
from django.db import migrations, models


def copy_legacy_blog_translations(apps, schema_editor):
    Author = apps.get_model("blog", "Author")
    AuthorTranslation = apps.get_model("blog", "AuthorTranslation")
    Tag = apps.get_model("blog", "Tag")
    TagTranslation = apps.get_model("blog", "TagTranslation")
    PostImage = apps.get_model("blog", "PostImage")
    PostImageTranslation = apps.get_model("blog", "PostImageTranslation")

    for author in Author.objects.all():
        AuthorTranslation.objects.update_or_create(
            author=author,
            language="en",
            defaults={
                "name": author.name,
                "bio": author.bio,
            },
        )

    for tag in Tag.objects.all():
        TagTranslation.objects.update_or_create(
            tag=tag,
            language="en",
            defaults={"name": tag.name},
        )

    for image in PostImage.objects.all():
        PostImageTranslation.objects.update_or_create(
            image=image,
            language="en",
            defaults={"caption": image.caption},
        )


def remove_copied_blog_translations(apps, schema_editor):
    AuthorTranslation = apps.get_model("blog", "AuthorTranslation")
    TagTranslation = apps.get_model("blog", "TagTranslation")
    PostImageTranslation = apps.get_model("blog", "PostImageTranslation")

    AuthorTranslation.objects.filter(language="en").delete()
    TagTranslation.objects.filter(language="en").delete()
    PostImageTranslation.objects.filter(language="en").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0004_initial_author_and_posts"),
    ]

    operations = [
        migrations.CreateModel(
            name="AuthorTranslation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "language",
                    models.CharField(
                        choices=[
                            ("en", "English"),
                            ("ru", "Русский"),
                            ("lv", "Latviešu"),
                        ],
                        max_length=5,
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("bio", models.TextField(blank=True)),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="blog.author",
                    ),
                ),
            ],
            options={
                "verbose_name": "Author Translation",
                "verbose_name_plural": "Author Translations",
                "db_table": "blog_author_translations",
                "ordering": ["author", "language"],
            },
        ),
        migrations.CreateModel(
            name="PostImageTranslation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "language",
                    models.CharField(
                        choices=[
                            ("en", "English"),
                            ("ru", "Русский"),
                            ("lv", "Latviešu"),
                        ],
                        max_length=5,
                    ),
                ),
                ("caption", models.CharField(blank=True, max_length=255)),
                (
                    "image",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="blog.postimage",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Image Translation",
                "verbose_name_plural": "Post Image Translations",
                "db_table": "blog_post_image_translations",
                "ordering": ["image", "language"],
            },
        ),
        migrations.CreateModel(
            name="TagTranslation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "language",
                    models.CharField(
                        choices=[
                            ("en", "English"),
                            ("ru", "Русский"),
                            ("lv", "Latviešu"),
                        ],
                        max_length=5,
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                (
                    "tag",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="blog.tag",
                    ),
                ),
            ],
            options={
                "verbose_name": "Tag Translation",
                "verbose_name_plural": "Tag Translations",
                "db_table": "blog_tag_translations",
                "ordering": ["tag", "language"],
            },
        ),
        migrations.AddConstraint(
            model_name="authortranslation",
            constraint=models.UniqueConstraint(
                fields=("author", "language"),
                name="unique_author_translation_language",
            ),
        ),
        migrations.AddConstraint(
            model_name="postimagetranslation",
            constraint=models.UniqueConstraint(
                fields=("image", "language"),
                name="unique_post_image_translation_language",
            ),
        ),
        migrations.AddConstraint(
            model_name="tagtranslation",
            constraint=models.UniqueConstraint(
                fields=("tag", "language"),
                name="unique_tag_translation_language",
            ),
        ),
        migrations.AddIndex(
            model_name="authortranslation",
            index=models.Index(
                fields=["author", "language"], name="blog_author_author__b99b4e_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="postimagetranslation",
            index=models.Index(
                fields=["image", "language"], name="blog_post_i_image_i_269dc6_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="tagtranslation",
            index=models.Index(
                fields=["tag", "language"], name="blog_tag_tr_tag_id_cec6c4_idx"
            ),
        ),
        migrations.RunPython(
            copy_legacy_blog_translations,
            remove_copied_blog_translations,
        ),
    ]
