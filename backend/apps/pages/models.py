from django.db import models


class About(models.Model):
    """About page content - single row."""

    # Multilingual
    bio_en = models.TextField()
    bio_ru = models.TextField(blank=True)
    bio_lv = models.TextField(blank=True)
    education_en = models.TextField(blank=True)
    education_ru = models.TextField(blank=True)
    education_lv = models.TextField(blank=True)
    qualifications_en = models.TextField(blank=True)
    qualifications_ru = models.TextField(blank=True)
    qualifications_lv = models.TextField(blank=True)

    photo = models.ImageField(upload_to="about/", blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_about"
        verbose_name = "About"
        verbose_name_plural = "About"

    def __str__(self):
        return "About"


class Experience(models.Model):
    """Professional experience entry - timeline item."""

    # Multilingual
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255, blank=True)
    title_lv = models.CharField(max_length=255, blank=True)
    company_en = models.CharField(max_length=255)
    company_ru = models.CharField(max_length=255, blank=True)
    company_lv = models.CharField(max_length=255, blank=True)
    description_en = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_lv = models.TextField(blank=True)

    start_year = models.IntegerField()
    end_year = models.IntegerField(null=True, blank=True)  # null = present
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "pages_experience"
        verbose_name = "Experience"
        verbose_name_plural = "Experience"
        ordering = ["-order", "-start_year"]

    def __str__(self):
        return f"{self.company_en} ({self.start_year})"


class Book(models.Model):
    """Book page content - single row."""

    # Multilingual
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255, blank=True)
    title_lv = models.CharField(max_length=255, blank=True)
    description_en = models.TextField()
    description_ru = models.TextField(blank=True)
    description_lv = models.TextField(blank=True)

    year = models.IntegerField()
    cover_image = models.ImageField(upload_to="book/", blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_book"
        verbose_name = "Book"
        verbose_name_plural = "Book"

    def __str__(self):
        return self.title_en


class Contact(models.Model):
    """Contact page - single row with links."""

    email = models.EmailField()
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_contact"
        verbose_name = "Contact"
        verbose_name_plural = "Contact"

    def __str__(self):
        return self.email
