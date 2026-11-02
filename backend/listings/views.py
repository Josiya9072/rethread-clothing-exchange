from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Listing
from .serializers import ListingSerializer, ListingValuePreviewSerializer
from .utils import compute_swap_value


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner_id == request.user.id


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related("owner").all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "status", "brand_tier", "condition"]
    search_fields = ["title", "location", "note"]
    ordering_fields = ["created_at", "estimated_value"]

    def get_queryset(self):
        qs = super().get_queryset()
        mine = self.request.query_params.get("mine")
        if mine == "true" and self.request.user.is_authenticated:
            qs = qs.filter(owner=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(["POST"])
def value_preview(request):
    serializer = ListingValuePreviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    value = compute_swap_value(**serializer.validated_data)
    return Response({"estimated_value": value})
