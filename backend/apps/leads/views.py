from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ArticleQuestionSerializer,
    ContactInquirySerializer,
    SubscribeSerializer,
)
from .services import (
    get_article_faq,
    get_client_ip,
    get_cms_success_message,
    hash_ip,
    process_article_question,
    process_contact_inquiry,
    process_subscribe,
)
from .services.newsletter import BrevoError
from .throttling import LeadsIPRateThrottle


class SubscribeView(APIView):
    """POST /api/leads/subscribe/ — newsletter subscription."""

    permission_classes = [AllowAny]
    throttle_classes = [LeadsIPRateThrottle]

    def post(self, request: Request) -> Response:
        serializer = SubscribeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"ok": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        if (data.get("website") or "").strip():
            message = get_cms_success_message("newsletter", "success", data["locale"])
            return Response({"ok": True, "message": message})

        ip_hash = hash_ip(get_client_ip(request))
        try:
            message = process_subscribe(data, ip_hash)
        except BrevoError:
            return Response(
                {
                    "ok": False,
                    "error": "Newsletter service temporarily unavailable.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"ok": True, "message": message})


class ArticleQuestionView(APIView):
    """POST /api/leads/article-question/ — question from a blog article."""

    permission_classes = [AllowAny]
    throttle_classes = [LeadsIPRateThrottle]

    def post(self, request: Request) -> Response:
        serializer = ArticleQuestionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"ok": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        if (data.get("website") or "").strip():
            message = get_cms_success_message(
                "article_question", "success", data["locale"]
            )
            return Response({"ok": True, "message": message})

        ip_hash = hash_ip(get_client_ip(request))
        try:
            message = process_article_question(data, ip_hash)
        except BrevoError:
            return Response(
                {
                    "ok": False,
                    "error": "Newsletter service temporarily unavailable.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"ok": True, "message": message})


class ContactInquiryView(APIView):
    """POST /api/leads/inquiries/ — contact form submission."""

    permission_classes = [AllowAny]
    throttle_classes = [LeadsIPRateThrottle]

    def post(self, request: Request) -> Response:
        serializer = ContactInquirySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"ok": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        if (data.get("website") or "").strip():
            message = get_cms_success_message(
                "form", "formSuccess", data["locale"], page="contact"
            )
            return Response({"ok": True, "message": message})

        ip_hash = hash_ip(get_client_ip(request))
        message = process_contact_inquiry(data, ip_hash)
        return Response({"ok": True, "message": message})


class ArticleFaqView(APIView):
    """GET /api/leads/faq/?article_slug=&lang= — published Q&A for an article."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        article_slug = (request.query_params.get("article_slug") or "").strip()
        lang = (request.query_params.get("lang") or "en").strip()
        if lang not in ("en", "ru", "lv"):
            lang = "en"
        if not article_slug:
            return Response(
                {"ok": False, "error": "article_slug is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        items = get_article_faq(article_slug, lang)
        return Response({"ok": True, "items": items})
