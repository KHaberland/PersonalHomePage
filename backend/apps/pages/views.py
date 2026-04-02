from django.http import Http404

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    About,
    Book,
    Contact,
    Experience,
    HomeBusinessOutcomeCard,
    HomeBusinessOutcomesIntro,
    HomeTechnicalSkillCard,
    HomeTechnicalSkillsIntro,
)
from .serializers import (
    AboutSerializer,
    BookSerializer,
    ContactSerializer,
    ExperienceSerializer,
    HomeBusinessOutcomeCardSerializer,
    HomeTechnicalSkillCardSerializer,
    _localized_text,
)


class AboutView(generics.RetrieveAPIView):
    """GET /api/about - Get about page content (first record)."""

    serializer_class = AboutSerializer

    def get_object(self):
        obj = About.objects.first()
        if obj is None:
            raise Http404("About content not found")
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class ExperienceListView(generics.ListAPIView):
    """GET /api/experience - List experience timeline."""

    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class BookView(generics.RetrieveAPIView):
    """GET /api/book - Get book page content (first record)."""

    serializer_class = BookSerializer

    def get_object(self):
        obj = Book.objects.first()
        if obj is None:
            raise Http404("Book content not found")
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class ContactView(generics.RetrieveAPIView):
    """GET /api/contact - Get contact info (first record)."""

    serializer_class = ContactSerializer

    def get_object(self):
        obj = Contact.objects.first()
        if obj is None:
            raise Http404("Contact info not found")
        return obj


class HomeTechnicalSkillsView(APIView):
    """GET /api/home-technical-skills/ — блок «Технические навыки» на главной."""

    def get(self, request):
        lang = request.query_params.get("lang", "en")
        intro = HomeTechnicalSkillsIntro.objects.first()
        items = HomeTechnicalSkillCard.objects.order_by("order")
        ctx = {"lang": lang}
        lead = _localized_text(intro, "lead", lang) if intro else ""
        return Response(
            {
                "technical_lead": lead,
                "items": HomeTechnicalSkillCardSerializer(
                    items, many=True, context=ctx
                ).data,
            }
        )


class HomeBusinessOutcomesView(APIView):
    """GET /api/home-business-outcomes/ — блок «Business outcomes» на главной."""

    def get(self, request):
        lang = request.query_params.get("lang", "en")
        intro = HomeBusinessOutcomesIntro.objects.first()
        items = HomeBusinessOutcomeCard.objects.order_by("order")
        ctx = {"lang": lang}
        subtitle = _localized_text(intro, "subtitle", lang) if intro else ""
        lead = _localized_text(intro, "lead", lang) if intro else ""
        return Response(
            {
                "business_subtitle": subtitle,
                "business_lead": lead,
                "items": HomeBusinessOutcomeCardSerializer(
                    items, many=True, context=ctx
                ).data,
            }
        )
