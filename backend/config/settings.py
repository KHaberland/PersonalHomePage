"""
Django settings for config project.
"""

import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-change-me-in-production")
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "django_ckeditor_5",
    # Local apps
    "apps.users",
    "apps.blog",
    "apps.pages",
    "apps.calculators",
    "apps.media",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

_default_db = os.getenv("DATABASE_URL")
if _default_db:
    DATABASES = {
        "default": dj_database_url.config(default=_default_db, conn_max_age=600)
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        )
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
LANGUAGES = [
    ("en", "English"),
    ("ru", "Русский"),
    ("lv", "Latviešu"),
]
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Media storage: AWS S3 (when configured) or local filesystem
_aws_bucket = os.getenv("AWS_STORAGE_BUCKET_NAME")
if _aws_bucket:
    _s3_options = {
        "bucket_name": _aws_bucket,
        "access_key": os.getenv("AWS_ACCESS_KEY_ID"),
        "secret_key": os.getenv("AWS_SECRET_ACCESS_KEY"),
        "region_name": os.getenv("AWS_S3_REGION_NAME", "eu-central-1"),
    }
    if os.getenv("AWS_S3_CUSTOM_DOMAIN"):
        _s3_options["custom_domain"] = os.getenv("AWS_S3_CUSTOM_DOMAIN")
    if os.getenv("AWS_S3_ENDPOINT_URL"):
        _s3_options["endpoint_url"] = os.getenv("AWS_S3_ENDPOINT_URL")
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
            "OPTIONS": _s3_options,
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
else:
    # Локальное хранилище (MEDIA_ROOT).
    # Для Cloudinary: django-cloudinary-storage + CLOUDINARY_URL
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CKEditor 5
CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"
CKEDITOR_5_CONFIGS = {
    "default": {
        "toolbar": [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "imageUpload",
        ],
    },
    "extends": {
        "blockToolbar": [
            "paragraph",
            "heading1",
            "heading2",
            "heading3",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
        ],
        "toolbar": {
            "items": [
                "heading",
                "|",
                "outdent",
                "indent",
                "|",
                "bold",
                "italic",
                "link",
                "underline",
                "strikethrough",
                "code",
                "subscript",
                "superscript",
                "highlight",
                "|",
                "codeBlock",
                "sourceEditing",
                "insertImage",
                "bulletedList",
                "numberedList",
                "todoList",
                "|",
                "blockQuote",
                "imageUpload",
                "|",
                "fontSize",
                "fontFamily",
                "fontColor",
                "fontBackgroundColor",
                "mediaEmbed",
                "removeFormat",
                "insertTable",
            ],
            "shouldNotGroupWhenFull": True,
        },
    },
}

# Custom User model
AUTH_USER_MODEL = "users.User"

# Вход в /admin/ и по username, и по email (первое поле формы)
AUTHENTICATION_BACKENDS = [
    "apps.users.backends.EmailOrUsernameModelBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# CORS
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(
    ","
)
CORS_ALLOW_CREDENTIALS = True

# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}
