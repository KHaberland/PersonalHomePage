from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Author, AuthorTranslation, Category, Post, Tag, TagTranslation


class BlogTranslationApiTests(TestCase):
    def setUp(self):
        Post.objects.all().delete()
        Tag.objects.all().delete()
        Category.objects.all().delete()
        Author.objects.all().delete()

        self.author = Author.objects.create(
            name="Oleg Suvorov",
            bio="English bio",
        )
        AuthorTranslation.objects.create(
            author=self.author,
            language="ru",
            name="Олег Суворов",
            bio="Русская биография",
        )
        self.category = Category.objects.create(
            name_en="Welding",
            name_ru="Сварка",
            name_lv="Metināšana",
            slug="welding",
        )
        self.tag = Tag.objects.create(name="Shielding Gas", slug="shielding-gas")
        TagTranslation.objects.create(
            tag=self.tag,
            language="ru",
            name="Защитный газ",
        )
        self.post = Post.objects.create(
            title_en="English title",
            title_ru="Русский заголовок",
            content_en="English content",
            content_ru="Русский текст",
            excerpt_en="English excerpt",
            excerpt_ru="Русский анонс",
            author=self.author,
            category=self.category,
            slug="translated-post",
            status=Post.Status.PUBLISHED,
            published_at=timezone.now(),
        )
        self.post.tags.add(self.tag)

    def test_posts_use_requested_translation_for_nested_entities(self):
        response = self.client.get(reverse("post-list"), {"lang": "ru"})

        self.assertEqual(response.status_code, 200)
        post = response.json()["results"][0]
        self.assertEqual(post["title"], "Русский заголовок")
        self.assertEqual(post["author"]["name"], "Олег Суворов")
        self.assertEqual(post["author"]["bio"], "Русская биография")
        self.assertEqual(post["tags"][0]["name"], "Защитный газ")

    def test_tags_fall_back_to_legacy_name_without_translation(self):
        response = self.client.get(reverse("tag-list"), {"lang": "lv"})

        self.assertEqual(response.status_code, 200)
        tag = response.json()["results"][0]
        self.assertEqual(tag["name"], "Shielding Gas")
