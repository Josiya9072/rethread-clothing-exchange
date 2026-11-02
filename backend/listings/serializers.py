from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id", "owner", "title", "category", "brand_tier", "condition",
            "size", "location", "note", "status", "estimated_value",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "owner", "status", "estimated_value", "created_at", "updated_at"]


class ListingValuePreviewSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=Listing.Category.choices)
    brand_tier = serializers.ChoiceField(choices=Listing.BrandTier.choices)
    condition = serializers.ChoiceField(choices=Listing.Condition.choices)
