from rest_framework import serializers
from accounts.serializers import UserSerializer
from listings.serializers import ListingSerializer
from listings.models import Listing
from .models import SwapRequest, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "swap", "sender", "text", "created_at"]
        read_only_fields = ["id", "sender", "created_at"]


class SwapRequestSerializer(serializers.ModelSerializer):
    listing_requested = ListingSerializer(read_only=True)
    listing_offered = ListingSerializer(read_only=True)
    requester = UserSerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    listing_requested_id = serializers.PrimaryKeyRelatedField(
        source="listing_requested", queryset=Listing.objects.all(), write_only=True
    )
    listing_offered_id = serializers.PrimaryKeyRelatedField(
        source="listing_offered", queryset=Listing.objects.all(), write_only=True
    )
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SwapRequest
        fields = [
            "id", "listing_requested", "listing_offered",
            "listing_requested_id", "listing_offered_id",
            "requester", "owner", "status", "messages",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "requester", "owner", "status", "created_at", "updated_at"]

    def validate(self, attrs):
        target = attrs["listing_requested"]
        offered = attrs["listing_offered"]
        request = self.context["request"]

        if target.owner_id == request.user.id:
            raise serializers.ValidationError("You can't propose a swap for your own listing.")
        if offered.owner_id != request.user.id:
            raise serializers.ValidationError("You can only offer an item you own.")
        if target.status != "available":
            raise serializers.ValidationError("That item is no longer available.")
        if offered.status != "available":
            raise serializers.ValidationError("The item you're offering isn't available.")
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["requester"] = request.user
        validated_data["owner"] = validated_data["listing_requested"].owner
        return super().create(validated_data)
