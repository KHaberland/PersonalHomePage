from django.test import TestCase
from django.urls import reverse

from .models import SiteTextBlock


class PageContentViewTests(TestCase):
    def setUp(self):
        SiteTextBlock.objects.all().delete()

    def test_returns_page_content_grouped_by_block_with_language_fallback(self):
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="hero",
            key="title",
            text_en="English title",
            text_ru="Русский заголовок",
        )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="hero",
            key="subtitle",
            text_en="English subtitle",
            text_ru="",
        )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.HOME,
            block="cta",
            key="title",
            text_en="English CTA",
            text_ru="Русский CTA",
        )
        SiteTextBlock.objects.create(
            page=SiteTextBlock.Page.ABOUT,
            block="hero",
            key="title",
            text_en="About title",
        )

        response = self.client.get(
            reverse("page-content", kwargs={"page": SiteTextBlock.Page.HOME}),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "cta": {
                    "title": "Русский CTA",
                },
                "hero": {
                    "subtitle": "English subtitle",
                    "title": "Русский заголовок",
                },
            },
        )

    def test_returns_empty_object_for_unknown_page(self):
        response = self.client.get(
            reverse("page-content", kwargs={"page": "missing"}),
            {"lang": "lv"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {})
