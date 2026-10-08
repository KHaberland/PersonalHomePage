from django.core.exceptions import ValidationError
from django.db import models


class SiteTextBlock(models.Model):
    """Universal multilingual CMS text entry for page sections and UI blocks."""

    class Page(models.TextChoices):
        HOME = "home", "Home"
        ABOUT = "about", "About"
        EXPERIENCE = "experience", "Experience"
        EXPERTISE = "expertise", "Expertise"
        SOLUTIONS = "solutions", "Solutions"
        KNOWLEDGE = "knowledge", "Knowledge"
        BLOG = "blog", "Blog"
        CALCULATORS = "calculators", "Calculators"
        TOOLS = "tools", "Tools"
        CONTACT = "contact", "Contact"
        BOOK = "book", "Book"
        COMMON = "common", "Common"

    page = models.CharField(max_length=50, choices=Page.choices)
    block = models.SlugField(max_length=100)
    key = models.SlugField(max_length=100)
    text_en = models.TextField(blank=True)
    text_ru = models.TextField(blank=True)
    text_lv = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_site_text_blocks"
        verbose_name = "Site text block"
        verbose_name_plural = "Site text blocks"
        ordering = ["page", "block", "key"]
        constraints = [
            models.UniqueConstraint(
                fields=["page", "block", "key"],
                name="unique_site_text_block_key",
            )
        ]
        indexes = [
            models.Index(fields=["page", "block"]),
            models.Index(fields=["page", "block", "key"]),
        ]

    def __str__(self):
        return f"{self.page}.{self.block}.{self.key}"


class SEOMetadata(models.Model):
    """Localized SEO metadata managed from Django Admin."""

    class Page(models.TextChoices):
        HOME = "home", "Home"
        ABOUT = "about", "About"
        EXPERIENCE = "experience", "Experience"
        EXPERTISE = "expertise", "Expertise"
        SOLUTIONS = "solutions", "Solutions"
        KNOWLEDGE = "knowledge", "Knowledge"
        BLOG = "blog", "Blog"
        TOOLS = "tools", "Tools"
        CONTACT = "contact", "Contact"
        BOOK = "book", "Book"

    class Language(models.TextChoices):
        EN = "en", "English"
        RU = "ru", "Русский"
        LV = "lv", "Latviešu"

    page = models.CharField(max_length=50, choices=Page.choices)
    language = models.CharField(max_length=5, choices=Language.choices)
    title = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_seo_metadata"
        verbose_name = "SEO metadata"
        verbose_name_plural = "SEO metadata"
        ordering = ["page", "language"]
        constraints = [
            models.UniqueConstraint(
                fields=["page", "language"],
                name="unique_seo_metadata_page_language",
            )
        ]
        indexes = [
            models.Index(fields=["page", "language"]),
        ]

    def __str__(self):
        return f"{self.page}.{self.language}"


class AboutMain(models.Model):
    """Краткий «Обо мне» на главной; полная биография — отдельная страница /about."""

    main_bio_en = models.TextField(blank=True)
    main_bio_ru = models.TextField(blank=True)
    main_bio_lv = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_about_main"
        verbose_name = "About – Main"
        verbose_name_plural = "About – Main"

    def __str__(self):
        return "About – Main"


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


class BookPageImage(models.Model):
    """Illustrative book page / spread for the /book preview block."""

    MAX_IMAGES_PER_BOOK = 12
    MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5 MB

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="page_images")
    image = models.ImageField(
        upload_to="book/pages/",
        help_text=(
            "JPG/WebP, ~3:2 or 16:10, width 1600–2000 px recommended. "
            f"Up to {MAX_IMAGES_PER_BOOK} images per book, max 5 MB each."
        ),
    )
    order = models.PositiveIntegerField(default=0)
    alt_en = models.CharField(max_length=255, blank=True)
    alt_ru = models.CharField(max_length=255, blank=True)
    alt_lv = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pages_book_page_images"
        ordering = ["order", "id"]
        verbose_name = "Book page image"
        verbose_name_plural = "Book page images"

    def __str__(self):
        return f"Book page #{self.order} ({self.book_id})"

    def clean(self):
        super().clean()
        if self.image:
            size = getattr(self.image, "size", None)
            if size and size > self.MAX_IMAGE_BYTES:
                max_mb = self.MAX_IMAGE_BYTES // (1024 * 1024)
                raise ValidationError(
                    {"image": f"Image file too large (max {max_mb} MB)."}
                )
        if self.book_id:
            siblings = BookPageImage.objects.filter(book_id=self.book_id)
            if self.pk:
                siblings = siblings.exclude(pk=self.pk)
            if siblings.count() >= self.MAX_IMAGES_PER_BOOK:
                raise ValidationError(
                    f"A book can have at most {self.MAX_IMAGES_PER_BOOK} page images."
                )


class HomeTechnicalSkillsIntro(models.Model):
    """Вводный абзац под заголовком «Технические навыки» на главной — одна запись."""

    lead_en = models.TextField(blank=True)
    lead_ru = models.TextField(blank=True)
    lead_lv = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_home_technical_skills_intro"
        verbose_name = "Home – Technical skills (lead)"
        verbose_name_plural = "Home – Technical skills (lead)"

    def __str__(self):
        return "Home – Technical skills (lead)"


class HomeBusinessOutcomesIntro(models.Model):
    """Подзаголовок и лид блока «Business outcomes» на главной — одна запись."""

    subtitle_en = models.CharField(max_length=500, blank=True)
    subtitle_ru = models.CharField(max_length=500, blank=True)
    subtitle_lv = models.CharField(max_length=500, blank=True)
    lead_en = models.TextField(blank=True)
    lead_ru = models.TextField(blank=True)
    lead_lv = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_home_business_outcomes_intro"
        verbose_name = "Home – Business outcomes (intro)"
        verbose_name_plural = "Home – Business outcomes (intro)"

    def __str__(self):
        return "Home – Business outcomes (intro)"


class HomeBusinessOutcomeCard(models.Model):
    """Карточка «business outcomes» на главной; порядок и иконки задаются в коде."""

    order = models.PositiveSmallIntegerField(unique=True)
    title_en = models.CharField(max_length=500)
    title_ru = models.CharField(max_length=500, blank=True)
    title_lv = models.CharField(max_length=500, blank=True)
    description_en = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_lv = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_home_business_outcome_card"
        verbose_name = "Home – Business outcome card"
        verbose_name_plural = "Home – Business outcome cards"
        ordering = ["order"]

    def __str__(self):
        return f"{self.order}. {self.title_en[:40]}"


class HomeTechnicalSkillCard(models.Model):
    """Карточка «технические навыки» на главной; порядок и иконки задаются в коде."""

    order = models.PositiveSmallIntegerField(unique=True)
    title_en = models.CharField(max_length=500)
    title_ru = models.CharField(max_length=500, blank=True)
    title_lv = models.CharField(max_length=500, blank=True)
    description_en = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_lv = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_home_technical_skill_card"
        verbose_name = "Home – Technical skill card"
        verbose_name_plural = "Home – Technical skill cards"
        ordering = ["order"]

    def __str__(self):
        return f"{self.order}. {self.title_en[:40]}"


# --- Solutions page: structured CMS for section columns ---

COLUMN_PROBLEM = "problem"
COLUMN_CAUSE = "cause"
COLUMN_ANALYSIS = "analysis"
COLUMN_SOLUTION = "solution"
COLUMN_RESULT = "result"

SOLUTION_COLUMN_CHOICES = [
    (COLUMN_PROBLEM, "Проблема"),
    (COLUMN_CAUSE, "Причина"),
    (COLUMN_ANALYSIS, "Инженерный анализ"),
    (COLUMN_SOLUTION, "Решение"),
    (COLUMN_RESULT, "Результат"),
]

COLUMN_TO_LIST_PREFIX = {
    COLUMN_PROBLEM: "problems",
    COLUMN_CAUSE: "causes",
    COLUMN_ANALYSIS: "analysisItems",
    COLUMN_SOLUTION: "solutionSteps",
    COLUMN_RESULT: "expectedResults",
}


def column_to_list_prefix(column: str) -> str:
    """Map column choice to API list key prefix (e.g. problem → problems)."""
    return COLUMN_TO_LIST_PREFIX[column]


def section_to_block_name(item_key: str) -> str:
    """Map section item_key to SiteTextBlock block (section_defectReduction, …)."""
    return f"section_{item_key}"


class SolutionSection(models.Model):
    """Solutions page section title (one of five cards)."""

    item_key = models.SlugField(max_length=50, unique=True)
    title_en = models.CharField(max_length=500, blank=True)
    title_ru = models.CharField(max_length=500, blank=True)
    title_lv = models.CharField(max_length=500, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_solution_section"
        verbose_name = "Solutions – секция"
        verbose_name_plural = "Solutions – секции"
        ordering = ["order", "item_key"]

    def __str__(self):
        return self.title_ru or self.title_en or self.item_key


class SolutionColumnGroup(models.Model):
    """One column of bullet paragraphs within a solutions section."""

    section = models.ForeignKey(
        SolutionSection,
        on_delete=models.CASCADE,
        related_name="column_groups",
    )
    column = models.CharField(max_length=20, choices=SOLUTION_COLUMN_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pages_solution_column_group"
        verbose_name = "Solutions – колонка"
        verbose_name_plural = "Solutions – колонки"
        ordering = ["section__order", "column"]
        constraints = [
            models.UniqueConstraint(
                fields=["section", "column"],
                name="unique_solution_section_column",
            )
        ]

    def __str__(self):
        column_label = dict(SOLUTION_COLUMN_CHOICES).get(self.column, self.column)
        return f"{self.section} → {column_label}"


class SolutionBullet(models.Model):
    """Single paragraph in a solutions column."""

    group = models.ForeignKey(
        SolutionColumnGroup,
        on_delete=models.CASCADE,
        related_name="bullets",
    )
    order = models.PositiveSmallIntegerField()
    text_en = models.TextField(blank=True)
    text_ru = models.TextField(blank=True)
    text_lv = models.TextField(blank=True)

    class Meta:
        db_table = "pages_solution_bullet"
        verbose_name = "Solutions – абзац"
        verbose_name_plural = "Solutions – абзацы"
        ordering = ["group", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["group", "order"],
                name="unique_solution_bullet_order",
            )
        ]

    def __str__(self):
        preview = (self.text_ru or self.text_en or "")[:40]
        return f"{self.group} #{self.order}: {preview}"


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
