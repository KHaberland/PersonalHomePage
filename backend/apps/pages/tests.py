from django.test import TestCase
from django.urls import reverse

from .models import SEOMetadata, SiteTextBlock


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


class SEOMetadataViewTests(TestCase):
    def setUp(self):
        SEOMetadata.objects.all().delete()

    def test_returns_seo_metadata_for_requested_language(self):
        SEOMetadata.objects.create(
            page=SEOMetadata.Page.HOME,
            language=SEOMetadata.Language.RU,
            title="Русский title",
            description="Русское description",
        )

        response = self.client.get(
            reverse("seo-metadata", kwargs={"page": SEOMetadata.Page.HOME}),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["page"], "home")
        self.assertEqual(data["language"], "ru")
        self.assertEqual(data["title"], "Русский title")
        self.assertEqual(data["description"], "Русское description")

    def test_unsupported_language_falls_back_to_english(self):
        SEOMetadata.objects.create(
            page=SEOMetadata.Page.HOME,
            language=SEOMetadata.Language.EN,
            title="English title",
            description="English description",
        )

        response = self.client.get(
            reverse("seo-metadata", kwargs={"page": SEOMetadata.Page.HOME}),
            {"lang": "de"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["language"], "en")
        self.assertEqual(data["title"], "English title")

    def test_returns_404_for_missing_page_metadata(self):
        response = self.client.get(
            reverse("seo-metadata", kwargs={"page": "missing"}),
            {"lang": "lv"},
        )

        self.assertEqual(response.status_code, 404)
