from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import RegisterView, MeView, EmailTokenObtainPairView, admin_stats

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", EmailTokenObtainPairView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/admin/stats/", admin_stats, name="admin-stats"),
    path("api/", include("listings.urls")),
    path("api/", include("swaps.urls")),
]
