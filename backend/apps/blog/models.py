from django.db import models


class LanguageChoices(models.TextChoices):
    EN = "en", "English"
    RU = "ru", "Русский"
    LV = "lv", "Latviešu"


class Author(models.Model):
    """Author of blog posts."""

    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="authors/", blank=True, null=True)

    class Meta:
        db_table = "blog_authors"
        verbose_name = "Author"
        verbose_name_plural = "Authors"

    def __str__(self):
        return self.name


class AuthorTranslation(models.Model):
    """Localized author profile fields."""

    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(max_length=5, choices=LanguageChoices.choices)
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)

    class Meta:
        db_table = "blog_author_translations"
        verbose_name = "Author Translation"
        verbose_name_plural = "Author Translations"
        ordering = ["author", "language"]
        constraints = [
            models.UniqueConstraint(
                fields=["author", "language"],
                name="unique_author_translation_language",
            )
        ]
        indexes = [
            models.Index(fields=["author", "language"]),
        ]

    def __str__(self):
        return f"{self.author} ({self.language})"


class Category(models.Model):
    """Blog post category."""

    name_en = models.CharField(max_length=100)
    name_ru = models.CharField(max_length=100)
    name_lv = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        db_table = "blog_categories"
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name_en


class Tag(models.Model):
    """Blog post tag."""

    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)

    class Meta:
        db_table = "blog_tags"
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

    def __str__(self):
        return self.name


class TagTranslation(models.Model):
    """Localized tag name."""

    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="translations")
    language = models.CharField(max_length=5, choices=LanguageChoices.choices)
    name = models.CharField(max_length=50)

    class Meta:
        db_table = "blog_tag_translations"
        verbose_name = "Tag Translation"
        verbose_name_plural = "Tag Translations"
        ordering = ["tag", "language"]
        constraints = [
            models.UniqueConstraint(
                fields=["tag", "language"],
                name="unique_tag_translation_language",
            )
        ]
        indexes = [
            models.Index(fields=["tag", "language"]),
        ]

    def __str__(self):
        return f"{self.tag.slug} ({self.language})"


class Post(models.Model):
    """Blog post with multilingual content."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    # Multilingual fields
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255, blank=True)
    title_lv = models.CharField(max_length=255, blank=True)
    content_en = models.TextField()
    content_ru = models.TextField(blank=True)
    content_lv = models.TextField(blank=True)
    excerpt_en = models.TextField(blank=True)
    excerpt_ru = models.TextField(blank=True)
    excerpt_lv = models.TextField(blank=True)

    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="posts")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="posts"
    )
    tags = models.ManyToManyField(
        Tag, blank=True, related_name="posts", db_table="blog_post_tags"
    )

    slug = models.SlugField(unique=True)
    cover_image = models.ImageField(upload_to="posts/", blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blog_posts"
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title_en


class PostImage(models.Model):
    """Image attached to a blog post."""

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="posts/images/")
    caption = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "blog_post_images"
        verbose_name = "Post Image"
        verbose_name_plural = "Post Images"

    def __str__(self):
        return f"Image for {self.post.slug}"


class PostImageTranslation(models.Model):
    """Localized image caption for blog post images."""

    image = models.ForeignKey(
        PostImage, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(max_length=5, choices=LanguageChoices.choices)
    caption = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "blog_post_image_translations"
        verbose_name = "Post Image Translation"
        verbose_name_plural = "Post Image Translations"
        ordering = ["image", "language"]
        constraints = [
            models.UniqueConstraint(
                fields=["image", "language"],
                name="unique_post_image_translation_language",
            )
        ]
        indexes = [
            models.Index(fields=["image", "language"]),
        ]

    def __str__(self):
        return f"{self.image} ({self.language})"
