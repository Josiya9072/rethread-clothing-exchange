from django.conf import settings
from django.db import models

from .utils import compute_swap_value


class Listing(models.Model):
    class Category(models.TextChoices):
        OUTERWEAR = "outerwear", "Outerwear"
        DRESS = "dress", "Dress"
        TOP = "top", "Top"
        BOTTOM = "bottom", "Bottom"
        FOOTWEAR = "footwear", "Footwear"
        ACCESSORY = "accessory", "Accessory"

    class BrandTier(models.TextChoices):
        PREMIUM = "premium", "Premium"
        MID_RANGE = "mid_range", "Mid-range"
        BUDGET = "budget", "Budget / unbranded"

    class Condition(models.TextChoices):
        NEW_WITH_TAGS = "new_with_tags", "New with tags"
        LIKE_NEW = "like_new", "Like new"
        GOOD = "good", "Good"
        FAIR = "fair", "Fair"

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        PENDING = "pending", "Pending"
        SWAPPED = "swapped", "Swapped"

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=160)
    category = models.CharField(max_length=20, choices=Category.choices)
    brand_tier = models.CharField(max_length=20, choices=BrandTier.choices)
    condition = models.CharField(max_length=20, choices=Condition.choices)
    size = models.CharField(max_length=40)
    location = models.CharField(max_length=120)
    note = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    estimated_value = models.PositiveIntegerField(editable=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        self.estimated_value = compute_swap_value(self.category, self.brand_tier, self.condition)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
