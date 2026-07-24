from django.urls import path

from . import views
from .webhooks import BrevoWebhookView

app_name = "leads"

urlpatterns = [
    path("leads/subscribe/", views.SubscribeView.as_view(), name="subscribe"),
    path(
        "leads/article-question/",
        views.ArticleQuestionView.as_view(),
        name="article-question",
    ),
    path(
        "leads/inquiries/",
        views.ContactInquiryView.as_view(),
        name="inquiries",
    ),
    path(
        "leads/faq/",
        views.ArticleFaqView.as_view(),
        name="faq",
    ),
    path(
        "leads/brevo/webhook/",
        BrevoWebhookView.as_view(),
        name="brevo-webhook",
    ),
]
