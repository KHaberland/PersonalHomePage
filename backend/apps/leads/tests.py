from io import BytesIO
from unittest.mock import MagicMock, patch

from django.core.cache import cache
from django.test import TestCase, TransactionTestCase, override_settings
from django.urls import reverse

from apps.blog.models import Author, Post
from apps.pages.models import SiteTextBlock

from .models import ArticleQuestion, ContactInquiry, LeadEvent, SubscriberReference
from .services.newsletter.base import QuestionNotifyRequest, SubscribeRequest
from .services.newsletter.brevo import (
    BrevoError,
    BrevoNewsletterProvider,
    BrevoProvider,
)


class LeadsModelsTest(TestCase):
    def test_create_article_question(self):
        question = ArticleQuestion.objects.create(
            name="John",
            email="john@example.com",
            locale="en",
            article_slug="mig-basics",
            article_title="MIG Welding Basics",
            question="Why porosity?",
        )
        self.assertEqual(question.status, ArticleQuestion.Status.NEW)
        self.assertFalse(question.answered)

    def test_create_subscriber_reference(self):
        subscriber = SubscriberReference.objects.create(
            email="reader@example.com",
            locale="ru",
            first_source=SubscriberReference.Source.BLOG_SUBSCRIBE,
        )
        self.assertTrue(subscriber.newsletter)
        self.assertFalse(subscriber.doi_confirmed)

    def test_create_lead_event(self):
        event = LeadEvent.objects.create(
            event_type=LeadEvent.EventType.SUBSCRIBE,
            email="reader@example.com",
            locale="ru",
            page_path="/ru/blog/mig-basics",
        )
        self.assertEqual(event.metadata, {})

    def test_create_contact_inquiry(self):
        inquiry = ContactInquiry.objects.create(
            name="Jane",
            email="jane@example.com",
            locale="lv",
            request_type=ContactInquiry.RequestType.TRAINING,
            message="Need training.",
            source_page="/lv/contact",
        )
        self.assertEqual(inquiry.status, ContactInquiry.Status.NEW)


class LeadsApiTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="newsletter",
            key="success",
            defaults={
                "text_en": "Newsletter success EN",
                "text_ru": "Newsletter success RU",
                "text_lv": "Newsletter success LV",
            },
        )
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="article_question",
            key="success",
            defaults={
                "text_en": "Question success EN",
                "text_ru": "Question success RU",
                "text_lv": "Question success LV",
            },
        )

    def test_subscribe_creates_records(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                reverse("leads:subscribe"),
                data={
                    "email": "reader@example.com",
                    "name": "Reader",
                    "locale": "ru",
                    "page_path": "/ru/blog/test-post",
                    "article_slug": "test-post",
                    "article_title": "Test Post",
                },
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["message"], "Newsletter success RU")
        self.assertTrue(
            SubscriberReference.objects.filter(
                email="reader@example.com",
                first_source=SubscriberReference.Source.BLOG_SUBSCRIBE,
            ).exists()
        )
        self.assertEqual(
            LeadEvent.objects.filter(
                event_type=LeadEvent.EventType.SUBSCRIBE,
                email="reader@example.com",
            ).count(),
            1,
        )

    def test_article_question_creates_records(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                reverse("leads:article-question"),
                data={
                    "name": "John",
                    "email": "john@example.com",
                    "question": "Why porosity?",
                    "locale": "en",
                    "article_slug": "mig-basics",
                    "article_title": "MIG Basics",
                    "subscribe_opt_in": False,
                },
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["message"], "Question success EN")
        self.assertTrue(
            ArticleQuestion.objects.filter(
                email="john@example.com",
                question="Why porosity?",
            ).exists()
        )
        self.assertEqual(
            LeadEvent.objects.filter(
                event_type=LeadEvent.EventType.QUESTION_SENT
            ).count(),
            1,
        )

    def test_article_question_with_subscribe_opt_in(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                reverse("leads:article-question"),
                data={
                    "name": "Jane",
                    "email": "jane@example.com",
                    "question": "Need help",
                    "locale": "ru",
                    "article_slug": "mig-basics",
                    "article_title": "MIG Basics",
                    "subscribe_opt_in": True,
                },
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            SubscriberReference.objects.filter(
                email="jane@example.com",
                first_source=SubscriberReference.Source.ARTICLE_QUESTION,
            ).exists()
        )
        self.assertEqual(
            LeadEvent.objects.filter(
                event_type=LeadEvent.EventType.SUBSCRIBE,
                email="jane@example.com",
            ).count(),
            1,
        )

    def test_honeypot_returns_ok_without_save(self):
        response = self.client.post(
            reverse("leads:subscribe"),
            data={
                "email": "bot@example.com",
                "locale": "en",
                "website": "spam",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])
        self.assertFalse(
            SubscriberReference.objects.filter(email="bot@example.com").exists()
        )

    def test_subscribe_invalid_email(self):
        response = self.client.post(
            reverse("leads:subscribe"),
            data={"email": "not-an-email", "locale": "en"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()["ok"])


class ContactInquiryApiTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="contact",
            block="form",
            key="formSuccess",
            defaults={
                "text_en": "Inquiry success EN",
                "text_ru": "Inquiry success RU",
                "text_lv": "Inquiry success LV",
            },
        )

    def test_inquiry_creates_records(self):
        response = self.client.post(
            reverse("leads:inquiries"),
            data={
                "name": "Jane",
                "email": "jane@example.com",
                "request_type": "training",
                "message": "Need training for team.",
                "locale": "ru",
                "page_path": "/ru/contact",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["message"], "Inquiry success RU")
        self.assertTrue(
            ContactInquiry.objects.filter(
                email="jane@example.com",
                request_type=ContactInquiry.RequestType.TRAINING,
            ).exists()
        )
        self.assertEqual(
            LeadEvent.objects.filter(
                event_type=LeadEvent.EventType.INQUIRY_SENT,
                email="jane@example.com",
            ).count(),
            1,
        )

    def test_inquiry_honeypot_returns_ok_without_save(self):
        response = self.client.post(
            reverse("leads:inquiries"),
            data={
                "name": "Bot",
                "email": "bot@example.com",
                "request_type": "defects",
                "message": "spam",
                "locale": "en",
                "website": "spam",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])
        self.assertFalse(
            ContactInquiry.objects.filter(email="bot@example.com").exists()
        )

    def test_inquiry_invalid_request_type(self):
        response = self.client.post(
            reverse("leads:inquiries"),
            data={
                "name": "Jane",
                "email": "jane@example.com",
                "request_type": "unknown",
                "message": "Hello",
                "locale": "en",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()["ok"])


LEADS_RATE_LIMIT_SETTINGS = {"LEADS_RATE_LIMIT": "2/minute"}


@override_settings(**LEADS_RATE_LIMIT_SETTINGS)
class LeadsRateLimitTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="newsletter",
            key="success",
            defaults={"text_en": "OK", "text_ru": "OK", "text_lv": "OK"},
        )
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="article_question",
            key="success",
            defaults={"text_en": "OK", "text_ru": "OK", "text_lv": "OK"},
        )
        SiteTextBlock.objects.update_or_create(
            page="contact",
            block="form",
            key="formSuccess",
            defaults={"text_en": "OK", "text_ru": "OK", "text_lv": "OK"},
        )

    def setUp(self):
        cache.clear()

    def test_subscribe_rate_limited(self):
        url = reverse("leads:subscribe")
        for index in range(2):
            response = self.client.post(
                url,
                data={"email": f"reader{index}@example.com", "locale": "en"},
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 200, msg=f"request {index + 1}")

        response = self.client.post(
            url,
            data={"email": "reader3@example.com", "locale": "en"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 429)

    def test_article_question_rate_limited(self):
        url = reverse("leads:article-question")
        payload = {
            "name": "John",
            "question": "Why?",
            "locale": "en",
            "article_slug": "test",
            "article_title": "Test",
        }
        for index in range(2):
            response = self.client.post(
                url,
                data={**payload, "email": f"john{index}@example.com"},
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 200, msg=f"request {index + 1}")

        response = self.client.post(
            url,
            data={**payload, "email": "john3@example.com"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 429)

    def test_inquiry_rate_limited(self):
        url = reverse("leads:inquiries")
        payload = {
            "name": "Jane",
            "request_type": "training",
            "message": "Hello",
            "locale": "en",
        }
        for index in range(2):
            response = self.client.post(
                url,
                data={**payload, "email": f"jane{index}@example.com"},
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 200, msg=f"request {index + 1}")

        response = self.client.post(
            url,
            data={**payload, "email": "jane3@example.com"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 429)


BREVO_SETTINGS = {
    "BREVO_API_KEY": "test-key",
    "BREVO_LIST_ID_BLOG": "42",
    "BREVO_DOI_TEMPLATE_ID": "7",
    "BREVO_DOI_REDIRECT_URL": "https://example.com/{locale}/blog?newsletter=confirmed",
}


@override_settings(**BREVO_SETTINGS)
class BrevoSubscribeIntegrationTest(TransactionTestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="newsletter",
            key="success",
            defaults={
                "text_en": "Newsletter success EN",
                "text_ru": "Newsletter success RU",
                "text_lv": "Newsletter success LV",
            },
        )

    def _mock_urlopen_response(self, payload=b'{"id": 999}'):
        mock_response = MagicMock()
        mock_response.read.return_value = payload
        mock_response.__enter__ = MagicMock(return_value=mock_response)
        mock_response.__exit__ = MagicMock(return_value=False)
        return mock_response

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_subscribe_triggers_brevo_doi(self, mock_urlopen):
        mock_urlopen.return_value = self._mock_urlopen_response()

        response = self.client.post(
            reverse("leads:subscribe"),
            data={
                "email": "reader@example.com",
                "name": "Reader",
                "locale": "ru",
                "article_slug": "test-post",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        mock_urlopen.assert_called_once()

        subscriber = SubscriberReference.objects.get(email="reader@example.com")
        self.assertEqual(subscriber.brevo_list_id, "42")
        self.assertEqual(subscriber.brevo_contact_id, "999")

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_subscribe_sets_brevo_pending_when_brevo_fails(self, mock_urlopen):
        from urllib import error

        mock_urlopen.side_effect = error.HTTPError(
            url=BrevoProvider.DOI_API_URL,
            code=400,
            msg="Bad Request",
            hdrs=None,
            fp=BytesIO(b'{"message":"invalid"}'),
        )

        response = self.client.post(
            reverse("leads:subscribe"),
            data={
                "email": "reader@example.com",
                "locale": "en",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])
        subscriber = SubscriberReference.objects.get(email="reader@example.com")
        self.assertTrue(subscriber.brevo_pending)

    def test_provider_builds_doi_payload(self):
        provider = BrevoNewsletterProvider()
        self.assertTrue(provider.is_configured())

        with patch.object(provider, "_post_json", return_value={"id": 1}) as mock_post:
            result = provider.subscribe_doi(
                SubscribeRequest(
                    email="reader@example.com",
                    locale="ru",
                    name="Reader",
                )
            )

        self.assertEqual(result.list_id, "42")
        self.assertEqual(result.contact_id, "1")
        mock_post.assert_called_once_with(
            BrevoProvider.DOI_API_URL,
            {
                "email": "reader@example.com",
                "includeListIds": [42],
                "templateId": 7,
                "redirectionUrl": "https://example.com/ru/blog?newsletter=confirmed",
                "attributes": {
                    "FIRSTNAME": "Reader",
                    "LANGUAGE": "ru",
                },
            },
        )

    def test_provider_not_configured_without_api_key(self):
        with override_settings(BREVO_API_KEY=""):
            provider = BrevoNewsletterProvider()
            self.assertFalse(provider.is_configured())
            with self.assertRaises(BrevoError):
                provider.subscribe_doi(SubscribeRequest(email="a@b.com", locale="en"))


BREVO_QUESTION_SETTINGS = {
    **BREVO_SETTINGS,
    "BREVO_SENDER_EMAIL": "noreply@example.com",
    "BREVO_SENDER_NAME": "Website",
    "BREVO_TEMPLATE_QUESTION_NOTIFY": "99",
    "BREVO_NOTIFY_EMAIL": "owner@example.com",
}


@override_settings(**BREVO_QUESTION_SETTINGS)
class BrevoQuestionNotifyIntegrationTest(TransactionTestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="article_question",
            key="success",
            defaults={
                "text_en": "Question success EN",
                "text_ru": "Question success RU",
                "text_lv": "Question success LV",
            },
        )

    def _mock_urlopen_response(self, payload=b'{"messageId": "abc-123"}'):
        mock_response = MagicMock()
        mock_response.read.return_value = payload
        mock_response.__enter__ = MagicMock(return_value=mock_response)
        mock_response.__exit__ = MagicMock(return_value=False)
        return mock_response

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_article_question_sends_transactional_email(self, mock_urlopen):
        mock_urlopen.return_value = self._mock_urlopen_response()

        response = self.client.post(
            reverse("leads:article-question"),
            data={
                "name": "John",
                "email": "john@example.com",
                "question": "Why porosity?",
                "locale": "en",
                "article_slug": "mig-basics",
                "article_title": "MIG Basics",
                "page_path": "/en/blog/mig-basics",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        mock_urlopen.assert_called_once()

        question = ArticleQuestion.objects.get(email="john@example.com")
        self.assertTrue(question.brevo_synced)

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_article_question_notify_failure_does_not_block_user(self, mock_urlopen):
        from urllib import error

        mock_urlopen.side_effect = error.HTTPError(
            url=BrevoProvider.SMTP_API_URL,
            code=500,
            msg="Server Error",
            hdrs=None,
            fp=BytesIO(b'{"message":"fail"}'),
        )

        response = self.client.post(
            reverse("leads:article-question"),
            data={
                "name": "John",
                "email": "john@example.com",
                "question": "Why porosity?",
                "locale": "en",
                "article_slug": "mig-basics",
                "article_title": "MIG Basics",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        question = ArticleQuestion.objects.get(email="john@example.com")
        self.assertFalse(question.brevo_synced)

    def test_provider_builds_question_notify_payload(self):
        provider = BrevoProvider()
        self.assertTrue(provider.is_question_notify_configured())

        with patch.object(
            provider, "_post_json", return_value={"messageId": "1"}
        ) as mock_post:
            result = provider.send_question_notification(
                QuestionNotifyRequest(
                    name="John",
                    email="john@example.com",
                    question="Why porosity?",
                    article_title="MIG Basics",
                    article_slug="mig-basics",
                    locale="en",
                    page_path="/en/blog/mig-basics",
                )
            )

        self.assertEqual(result.message_id, "1")
        mock_post.assert_called_once_with(
            BrevoProvider.SMTP_API_URL,
            {
                "sender": {"email": "noreply@example.com", "name": "Website"},
                "to": [{"email": "owner@example.com"}],
                "replyTo": {"email": "john@example.com", "name": "John"},
                "templateId": 99,
                "params": {
                    "NAME": "John",
                    "EMAIL": "john@example.com",
                    "QUESTION": "Why porosity?",
                    "ARTICLE_TITLE": "MIG Basics",
                    "ARTICLE_SLUG": "mig-basics",
                    "LOCALE": "en",
                    "PAGE_PATH": "/en/blog/mig-basics",
                },
            },
        )


class BrevoWebhookTest(TestCase):
    @override_settings(BREVO_WEBHOOK_SECRET="test-secret", BREVO_LIST_ID_BLOG="42")
    def test_list_addition_confirms_subscriber(self):
        SubscriberReference.objects.create(
            email="reader@example.com",
            locale="ru",
            first_source=SubscriberReference.Source.BLOG_SUBSCRIBE,
        )

        response = self.client.post(
            reverse("leads:brevo-webhook"),
            data={
                "event": "list_addition",
                "email": "reader@example.com",
                "list_id": [42],
            },
            content_type="application/json",
            HTTP_X_WEBHOOK_SECRET="test-secret",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["handled"])
        subscriber = SubscriberReference.objects.get(email="reader@example.com")
        self.assertTrue(subscriber.doi_confirmed)
        self.assertTrue(
            LeadEvent.objects.filter(
                event_type=LeadEvent.EventType.DOI_CONFIRMED,
                email="reader@example.com",
            ).exists()
        )

    @override_settings(BREVO_WEBHOOK_SECRET="test-secret", BREVO_LIST_ID_BLOG="42")
    def test_list_addition_ignores_other_lists(self):
        SubscriberReference.objects.create(
            email="reader@example.com",
            locale="ru",
        )

        response = self.client.post(
            reverse("leads:brevo-webhook"),
            data={
                "event": "list_addition",
                "email": "reader@example.com",
                "list_id": [99],
            },
            content_type="application/json",
            HTTP_X_WEBHOOK_SECRET="test-secret",
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["handled"])
        subscriber = SubscriberReference.objects.get(email="reader@example.com")
        self.assertFalse(subscriber.doi_confirmed)

    @override_settings(BREVO_WEBHOOK_SECRET="test-secret")
    def test_unsubscribe_updates_subscriber(self):
        SubscriberReference.objects.create(
            email="reader@example.com",
            locale="ru",
            doi_confirmed=True,
        )

        response = self.client.post(
            reverse("leads:brevo-webhook"),
            data={"event": "unsubscribe", "email": "reader@example.com"},
            content_type="application/json",
            HTTP_X_WEBHOOK_SECRET="test-secret",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["handled"])
        subscriber = SubscriberReference.objects.get(email="reader@example.com")
        self.assertFalse(subscriber.newsletter)
        self.assertFalse(subscriber.doi_confirmed)

    @override_settings(BREVO_WEBHOOK_SECRET="test-secret")
    def test_webhook_rejects_invalid_secret(self):
        response = self.client.post(
            reverse("leads:brevo-webhook"),
            data={"event": "unsubscribe", "email": "reader@example.com"},
            content_type="application/json",
            HTTP_X_WEBHOOK_SECRET="wrong",
        )
        self.assertEqual(response.status_code, 403)

    @override_settings(BREVO_WEBHOOK_SECRET="")
    def test_webhook_unavailable_without_secret(self):
        response = self.client.post(
            reverse("leads:brevo-webhook"),
            data={"event": "unsubscribe", "email": "reader@example.com"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 503)


class PostNewsletterCampaignTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.author = Author.objects.create(name="Author")
        cls.post = Post.objects.create(
            title_en="MIG Basics",
            title_ru="Основы MIG",
            content_en="<p>Content</p>",
            excerpt_en="Excerpt EN",
            excerpt_ru="Анонс RU",
            author=cls.author,
            slug="mig-basics",
            status=Post.Status.PUBLISHED,
        )

    @override_settings(
        BREVO_API_KEY="key",
        BREVO_LIST_ID_BLOG="42",
        BREVO_SENDER_EMAIL="noreply@example.com",
        BREVO_SENDER_NAME="Blog",
        CORS_ALLOWED_ORIGINS=["https://example.com"],
    )
    @patch.object(BrevoProvider, "_post_json")
    def test_send_post_newsletter_creates_campaign(self, mock_post):
        from apps.leads.services.newsletter import send_post_newsletter

        mock_post.side_effect = [{"id": 101}, {}]

        results = send_post_newsletter(self.post, locales=["en"])
        self.assertEqual(results[0]["status"], "sent")
        self.assertEqual(results[0]["campaign_id"], "101")
        self.assertTrue(
            LeadEvent.objects.filter(
                event_type=LeadEvent.EventType.ARTICLE_NEWSLETTER_SENT,
                article_slug="mig-basics",
                locale="en",
            ).exists()
        )
        self.assertEqual(mock_post.call_count, 2)

    @override_settings(
        BREVO_API_KEY="key",
        BREVO_LIST_ID_BLOG="42",
        BREVO_SENDER_EMAIL="noreply@example.com",
    )
    @patch.object(BrevoProvider, "_post_json")
    def test_send_post_newsletter_idempotent(self, mock_post):
        from apps.leads.services.newsletter import send_post_newsletter

        LeadEvent.objects.create(
            event_type=LeadEvent.EventType.ARTICLE_NEWSLETTER_SENT,
            article_slug="mig-basics",
            locale="en",
        )

        results = send_post_newsletter(self.post, locales=["en"])
        self.assertEqual(results[0]["status"], "skipped")
        self.assertEqual(results[0]["reason"], "already_sent")
        mock_post.assert_not_called()

    @override_settings(
        BREVO_API_KEY="key",
        BREVO_LIST_ID_BLOG="42",
        BREVO_SENDER_EMAIL="noreply@example.com",
        CORS_ALLOWED_ORIGINS=["https://example.com"],
    )
    def test_send_post_newsletter_dry_run(self):
        from apps.leads.services.newsletter import send_post_newsletter

        results = send_post_newsletter(self.post, locales=["ru"], dry_run=True)
        self.assertEqual(results[0]["status"], "dry_run")
        self.assertEqual(results[0]["subject"], "Основы MIG")


BREVO_INQUIRY_SETTINGS = {
    **BREVO_QUESTION_SETTINGS,
    "BREVO_TEMPLATE_INQUIRY_NOTIFY": "88",
}


@override_settings(**BREVO_INQUIRY_SETTINGS)
class BrevoInquiryNotifyIntegrationTest(TransactionTestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="contact",
            block="form",
            key="formSuccess",
            defaults={
                "text_en": "Inquiry success EN",
                "text_ru": "Inquiry success RU",
                "text_lv": "Inquiry success LV",
            },
        )

    def _mock_urlopen_response(self, payload=b'{"messageId": "inq-123"}'):
        mock_response = MagicMock()
        mock_response.read.return_value = payload
        mock_response.__enter__ = MagicMock(return_value=mock_response)
        mock_response.__exit__ = MagicMock(return_value=False)
        return mock_response

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_inquiry_sends_transactional_email(self, mock_urlopen):
        mock_urlopen.return_value = self._mock_urlopen_response()

        response = self.client.post(
            reverse("leads:inquiries"),
            data={
                "name": "Jane",
                "email": "jane@example.com",
                "request_type": "training",
                "message": "Need training.",
                "locale": "ru",
                "page_path": "/ru/contact",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        mock_urlopen.assert_called_once()
        inquiry = ContactInquiry.objects.get(email="jane@example.com")
        self.assertTrue(inquiry.brevo_synced)

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_inquiry_notify_failure_does_not_block_user(self, mock_urlopen):
        from urllib import error

        mock_urlopen.side_effect = error.HTTPError(
            url=BrevoProvider.SMTP_API_URL,
            code=500,
            msg="Server Error",
            hdrs=None,
            fp=BytesIO(b'{"message":"fail"}'),
        )

        response = self.client.post(
            reverse("leads:inquiries"),
            data={
                "name": "Jane",
                "email": "jane@example.com",
                "request_type": "training",
                "message": "Need training.",
                "locale": "en",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        inquiry = ContactInquiry.objects.get(email="jane@example.com")
        self.assertFalse(inquiry.brevo_synced)


class ArticleFaqApiTest(TestCase):
    def test_faq_returns_answered_questions(self):
        ArticleQuestion.objects.create(
            name="John",
            email="john@example.com",
            locale="en",
            article_slug="mig-basics",
            article_title="MIG Basics",
            question="Why porosity?",
            answered=True,
            answer_text="Check gas flow.",
        )
        ArticleQuestion.objects.create(
            name="Jane",
            email="jane@example.com",
            locale="en",
            article_slug="mig-basics",
            article_title="MIG Basics",
            question="Unanswered?",
            answered=False,
        )

        response = self.client.get(
            reverse("leads:faq"),
            {"article_slug": "mig-basics", "lang": "en"},
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(len(payload["items"]), 1)
        self.assertEqual(payload["items"][0]["question"], "Why porosity?")
        self.assertEqual(payload["items"][0]["answer"], "Check gas flow.")

    def test_faq_requires_article_slug(self):
        response = self.client.get(reverse("leads:faq"))
        self.assertEqual(response.status_code, 400)


@override_settings(**BREVO_SETTINGS)
class RetryBrevoSyncTest(TransactionTestCase):
    @classmethod
    def setUpTestData(cls):
        SiteTextBlock.objects.update_or_create(
            page="blog",
            block="newsletter",
            key="success",
            defaults={"text_en": "OK", "text_ru": "OK", "text_lv": "OK"},
        )

    def _mock_urlopen_response(self, payload=b'{"id": 999}'):
        mock_response = MagicMock()
        mock_response.read.return_value = payload
        mock_response.__enter__ = MagicMock(return_value=mock_response)
        mock_response.__exit__ = MagicMock(return_value=False)
        return mock_response

    @patch("apps.leads.services.newsletter.brevo.request.urlopen")
    def test_retry_command_clears_brevo_pending(self, mock_urlopen):
        from django.core.management import call_command

        mock_urlopen.return_value = self._mock_urlopen_response()
        subscriber = SubscriberReference.objects.create(
            email="reader@example.com",
            locale="en",
            brevo_pending=True,
        )
        LeadEvent.objects.create(
            event_type=LeadEvent.EventType.SUBSCRIBE,
            email="reader@example.com",
            locale="en",
            metadata={"name": "Reader"},
        )

        call_command("retry_brevo_sync")

        subscriber.refresh_from_db()
        self.assertFalse(subscriber.brevo_pending)
        self.assertEqual(subscriber.brevo_contact_id, "999")
