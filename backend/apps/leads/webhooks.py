import json
import logging

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import process_brevo_webhook_event

logger = logging.getLogger(__name__)


class BrevoWebhookView(APIView):
    """POST /api/leads/brevo/webhook/ — Brevo marketing events (DOI, unsubscribe)."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request) -> Response:
        secret = settings.BREVO_WEBHOOK_SECRET.strip()
        if not secret:
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

        provided = (
            request.headers.get("X-Webhook-Secret", "").strip()
            or request.query_params.get("secret", "").strip()
        )
        if provided != secret:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            payload = (
                request.data
                if isinstance(request.data, dict)
                else json.loads(request.body.decode("utf-8") or "{}")
            )
        except (json.JSONDecodeError, UnicodeDecodeError):
            return Response(
                {"ok": False, "error": "Invalid JSON"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        handled = process_brevo_webhook_event(payload)
        return Response({"ok": True, "handled": handled})
