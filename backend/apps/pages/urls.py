from django.urls import path

from . import views

urlpatterns = [
    path("about/", views.AboutView.as_view(), name="about"),
    path("experience/", views.ExperienceListView.as_view(), name="experience"),
    path("book/", views.BookView.as_view(), name="book"),
    path("contact/", views.ContactView.as_view(), name="contact"),
    path(
        "home-technical-skills/",
        views.HomeTechnicalSkillsView.as_view(),
        name="home-technical-skills",
    ),
]
