from django.db import models as dj_models
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from listings.models import Listing
from .models import SwapRequest, ChatMessage
from .serializers import SwapRequestSerializer, ChatMessageSerializer


class IsParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.id in (obj.requester_id, obj.owner_id)


class SwapRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        return (
            SwapRequest.objects.filter(dj_models.Q(requester=user) | dj_models.Q(owner=user))
            .select_related("listing_requested", "listing_offered", "requester", "owner")
            .prefetch_related("messages", "messages__sender")
        )

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        swap = self.get_object()
        if swap.owner_id != request.user.id:
            return Response({"detail": "Only the listing owner can accept."}, status=403)
        if swap.status != SwapRequest.Status.PENDING:
            return Response({"detail": "This swap is no longer pending."}, status=400)
        swap.status = SwapRequest.Status.ACCEPTED
        swap.save()
        Listing.objects.filter(id__in=[swap.listing_requested_id, swap.listing_offered_id]).update(
            status=Listing.Status.PENDING
        )
        return Response(SwapRequestSerializer(swap, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        swap = self.get_object()
        if swap.owner_id != request.user.id:
            return Response({"detail": "Only the listing owner can decline."}, status=403)
        if swap.status != SwapRequest.Status.PENDING:
            return Response({"detail": "This swap is no longer pending."}, status=400)
        swap.status = SwapRequest.Status.REJECTED
        swap.save()
        return Response(SwapRequestSerializer(swap, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        swap = self.get_object()
        if swap.status != SwapRequest.Status.ACCEPTED:
            return Response({"detail": "Only an accepted swap can be completed."}, status=400)
        swap.status = SwapRequest.Status.COMPLETED
        swap.save()
        Listing.objects.filter(id__in=[swap.listing_requested_id, swap.listing_offered_id]).update(
            status=Listing.Status.SWAPPED
        )
        return Response(SwapRequestSerializer(swap, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        swap = self.get_object()
        text = request.data.get("text", "").strip()
        if not text:
            return Response({"detail": "Message can't be empty."}, status=400)
        message = ChatMessage.objects.create(swap=swap, sender=request.user, text=text)
        return Response(ChatMessageSerializer(message).data, status=201)
