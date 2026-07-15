# flake8: noqa: E501
from django.db import migrations, models


BLOG_UI_BLOCKS = [
    ("title", "Blog", "Блог", "Blogs"),
    (
        "description",
        "Chronological publications, updates, and author commentary on welding. For topic-based explanations, use the knowledge base.",
        "Хронологические публикации, обновления и авторские комментарии по сварке. Для объяснений по темам используйте базу знаний.",
        "Hronoloģiskas publikācijas, jaunumi un autora komentāri par metināšanu. Tēmu skaidrojumiem izmantojiet zināšanu bāzi.",
    ),
    (
        "knowledgeCrossLink",
        "For structured process explanations grouped by topic, open",
        "Структурные объяснения процессов по темам — в разделе",
        "Strukturētus procesa skaidrojumus pēc tēmām atveriet sadaļā",
    ),
    ("filterByCategory", "Categories", "Категории", "Kategorijas"),
    ("allCategories", "All", "Все", "Visi"),
    ("filterByTag", "Tags", "Теги", "Birkas"),
    ("allTags", "All tags", "Все теги", "Visas birkas"),
    ("noArticles", "No articles yet.", "Статей пока нет.", "Rakstu vēl nav."),
    ("pagination", "Pagination", "Навигация по страницам", "Lapdales navigācija"),
    ("previous", "Previous", "Назад", "Atpakaļ"),
    ("next", "Next", "Вперёд", "Tālāk"),
    (
        "pageOf",
        "Page {current} of {total}",
        "Страница {current} из {total}",
        "Lapa {current} no {total}",
    ),
    ("backToBlog", "Back to blog", "Назад к блогу", "Atpakaļ uz blogu"),
    ("relatedPosts", "Related articles", "Похожие статьи", "Līdzīgi raksti"),
    ("readMore", "Read more", "Подробнее", "Pilns raksts"),
]


def seed_blog_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    for key, text_en, text_ru, text_lv in BLOG_UI_BLOCKS:
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="ui",
            key=key,
            defaults={
                "text_en": text_en,
                "text_ru": text_ru,
                "text_lv": text_lv,
            },
        )


def remove_blog_ui(apps, schema_editor):
    SiteTextBlock = apps.get_model("pages", "SiteTextBlock")
    SiteTextBlock.objects.filter(
        page="blog",
        block="ui",
        key__in=[key for key, *_ in BLOG_UI_BLOCKS],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0029_knowledge_ui_site_text_blocks"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sitetextblock",
            name="page",
            field=models.CharField(
                choices=[
                    ("home", "Home"),
                    ("about", "About"),
                    ("experience", "Experience"),
                    ("expertise", "Expertise"),
                    ("solutions", "Solutions"),
                    ("knowledge", "Knowledge"),
                    ("blog", "Blog"),
                    ("tools", "Tools"),
                    ("contact", "Contact"),
                    ("book", "Book"),
                ],
                max_length=50,
            ),
        ),
        migrations.RunPython(seed_blog_ui, remove_blog_ui),
    ]
