from django.db import models


class LocaleChoices(models.TextChoices):
    EN = "en", "English"
    RU = "ru", "Русский"
    LV = "lv", "Latviešu"


class ArticleQuestion(models.Model):
    """Question submitted from a blog article."""

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In progress"
        ANSWERED = "answered", "Answered"
        ARCHIVED = "archived", "Archived"

    name = models.CharField(max_length=255)
    email = models.EmailField()
    locale = models.CharField(max_length=5, choices=LocaleChoices.choices)
    post = models.ForeignKey(
        "blog.Post",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="article_questions",
    )
    article_slug = models.SlugField(max_length=255, blank=True)
    article_title = models.CharField(max_length=255, blank=True)
    question = models.TextField()
    subscribe_opt_in = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    answered = models.BooleanField(default=False)
    answer_text = models.TextField(blank=True)
    answered_at = models.DateTimeField(null=True, blank=True)
    brevo_synced = models.BooleanField(default=False)
    ip_hash = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "leads_article_questions"
        verbose_name = "Article question"
        verbose_name_plural = "Article questions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["email"]),
            models.Index(fields=["article_slug"]),
        ]

    def __str__(self):
        return f"{self.email} — {self.article_title or self.article_slug or 'article'}"


class ContactInquiry(models.Model):
    """Contact form submission from /contact."""

    class RequestType(models.TextChoices):
        DEFECTS = "defects", "Defects"
        PROCESS = "process", "Process"
        TRAINING = "training", "Training"
        COOPERATION = "cooperation", "Cooperation"
        COMMERCIAL = "commercial", "Commercial"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        NEW = "new", "New"
        REPLIED = "replied", "Replied"
        CLOSED = "closed", "Closed"

    name = models.CharField(max_length=255)
    email = models.EmailField()
    locale = models.CharField(max_length=5, choices=LocaleChoices.choices)
    request_type = models.CharField(max_length=32, choices=RequestType.choices)
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    answered = models.BooleanField(default=False)
    answer_text = models.TextField(blank=True)
    source_page = models.CharField(max_length=255, blank=True)
    brevo_synced = models.BooleanField(default=False)
    ip_hash = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "leads_contact_inquiries"
        verbose_name = "Contact inquiry"
        verbose_name_plural = "Contact inquiries"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["email"]),
            models.Index(fields=["request_type"]),
        ]

    def __str__(self):
        return f"{self.email} — {self.get_request_type_display()}"


class SubscriberReference(models.Model):
    """Local reference to a newsletter subscriber (master list in Brevo)."""

    class Source(models.TextChoices):
        BLOG_SUBSCRIBE = "blog_subscribe", "Blog subscribe"
        ARTICLE_QUESTION = "article_question", "Article question"
        CONTACT = "contact", "Contact"
        OTHER = "other", "Other"

    email = models.EmailField(unique=True)
    locale = models.CharField(max_length=5, choices=LocaleChoices.choices)
    newsletter = models.BooleanField(default=True)
    brevo_contact_id = models.CharField(max_length=64, blank=True)
    brevo_list_id = models.CharField(max_length=64, blank=True)
    doi_confirmed = models.BooleanField(default=False)
    first_source = models.CharField(
        max_length=32,
        choices=Source.choices,
        default=Source.OTHER,
    )
    first_article_slug = models.SlugField(max_length=255, blank=True)
    brevo_pending = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "leads_subscriber_references"
        verbose_name = "Subscriber reference"
        verbose_name_plural = "Subscriber references"
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["newsletter", "doi_confirmed"]),
            models.Index(fields=["first_source"]),
            models.Index(fields=["brevo_pending", "newsletter"]),
        ]

    def __str__(self):
        return self.email


class LeadEvent(models.Model):
    """Audit log for subscriptions, questions, and inquiries."""

    class EventType(models.TextChoices):
        SUBSCRIBE = "subscribe", "Subscribe"
        QUESTION_SENT = "question_sent", "Question sent"
        INQUIRY_SENT = "inquiry_sent", "Inquiry sent"
        DOI_CONFIRMED = "doi_confirmed", "DOI confirmed"
        UNSUBSCRIBE = "unsubscribe", "Unsubscribe"
        ARTICLE_NEWSLETTER_SENT = "article_newsletter_sent", "Article newsletter sent"

    event_type = models.CharField(max_length=32, choices=EventType.choices)
    email = models.EmailField(blank=True)
    locale = models.CharField(max_length=5, choices=LocaleChoices.choices, blank=True)
    page_path = models.CharField(max_length=512, blank=True)
    article_slug = models.SlugField(max_length=255, blank=True)
    referrer = models.CharField(max_length=512, blank=True)
    utm_source = models.CharField(max_length=255, blank=True)
    utm_medium = models.CharField(max_length=255, blank=True)
    utm_campaign = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "leads_events"
        verbose_name = "Lead event"
        verbose_name_plural = "Lead events"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["event_type", "-created_at"]),
            models.Index(fields=["email"]),
            models.Index(fields=["article_slug"]),
        ]

    def __str__(self):
        target = self.email or self.page_path or self.event_type
        return f"{self.event_type} — {target}"
