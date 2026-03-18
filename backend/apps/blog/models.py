from django.db import models


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
