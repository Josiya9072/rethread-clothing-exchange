from django.contrib import admin
from .models import SwapRequest, ChatMessage


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ("sender", "text", "created_at")


@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "listing_requested", "listing_offered", "requester", "owner", "status", "created_at")
    list_filter = ("status",)
    inlines = [ChatMessageInline]
