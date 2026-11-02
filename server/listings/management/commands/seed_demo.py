from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from listings.models import Listing

User = get_user_model()

DEMO_USERS = [
    {"email": "meera@example.com", "name": "Meera K.", "location": "Kozhikode"},
    {"email": "arjun@example.com", "name": "Arjun P.", "location": "Kochi"},
    {"email": "divya@example.com", "name": "Divya S.", "location": "Bengaluru"},
]

DEMO_LISTINGS = [
    ("meera@example.com", "Denim jacket, oversized fit", "outerwear", "mid_range", "like_new", "M", "Worn twice, slight fade at cuffs."),
    ("meera@example.com", "Floral wrap dress", "dress", "budget", "good", "S", "Great for summer, true to size."),
    ("arjun@example.com", "Leather chelsea boots", "footwear", "premium", "good", "UK 8", "Resoled once, still sturdy."),
    ("arjun@example.com", "Formal cotton shirt", "top", "mid_range", "new_with_tags", "L", "Bought for an event that got cancelled."),
    ("divya@example.com", "Wide-leg trousers", "bottom", "mid_range", "like_new", "M", "Only altered length, easy to redo."),
    ("divya@example.com", "Woven cane tote bag", "accessory", "budget", "good", "One size", "Sturdy, holds a laptop fine."),
]


class Command(BaseCommand):
    help = "Seed demo users and listings for local testing."

    def handle(self, *args, **options):
        created_users = {}
        for u in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=u["email"], defaults={"name": u["name"], "location": u["location"]}
            )
            if created:
                user.set_password("seed12345")
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user {user.email} (password: seed12345)"))
            created_users[u["email"]] = user

        for email, title, category, brand_tier, condition, size, note in DEMO_LISTINGS:
            owner = created_users[email]
            if not Listing.objects.filter(owner=owner, title=title).exists():
                Listing.objects.create(
                    owner=owner, title=title, category=category, brand_tier=brand_tier,
                    condition=condition, size=size, location=owner.location, note=note,
                )
                self.stdout.write(self.style.SUCCESS(f"Created listing: {title}"))

        self.stdout.write(self.style.SUCCESS("Demo data ready."))
