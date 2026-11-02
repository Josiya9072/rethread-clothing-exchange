from django.contrib import admin
from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "category", "status", "estimated_value", "created_at")
    list_filter = ("category", "status", "brand_tier", "condition")
    search_fields = ("title", "owner__email", "owner__name", "location")
