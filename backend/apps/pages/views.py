from django.http import Http404

from rest_framework import generics

from .models import About, Book, Contact, Experience
from .serializers import (
    AboutSerializer,
    BookSerializer,
    ContactSerializer,
    ExperienceSerializer,
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
