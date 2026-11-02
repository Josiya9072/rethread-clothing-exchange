from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import SwapRequestViewSet

router = DefaultRouter()
router.register("swaps", SwapRequestViewSet, basename="swap")

urlpatterns = [
    path("", include(router.urls)),
]
