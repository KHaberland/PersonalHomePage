from django.urls import path

from . import views

urlpatterns = [
    path("login", views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh", views.TokenRefreshView.as_view(), name="token_refresh"),
]
