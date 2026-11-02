from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ListingViewSet, value_preview

router = DefaultRouter()
router.register("listings", ListingViewSet, basename="listing")

urlpatterns = [
    path("listings/value-preview/", value_preview, name="value-preview"),
    path("", include(router.urls)),
]
