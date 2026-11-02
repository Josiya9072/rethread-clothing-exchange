"""Swap value calculator.

Estimates a clothing item's swap value in points based on category,
brand tier, and condition. Used both to suggest fair matches and to
show a value comparison on either side of a proposed swap.
"""

CATEGORY_BASE = {
    "outerwear": 42,
    "dress": 34,
    "footwear": 32,
    "top": 16,
    "bottom": 22,
    "accessory": 12,
}

BRAND_BONUS = {
    "premium": 22,
    "mid_range": 10,
    "budget": 0,
}

CONDITION_MULTIPLIER = {
    "new_with_tags": 1.5,
    "like_new": 1.2,
    "good": 1.0,
    "fair": 0.7,
}


def compute_swap_value(category, brand_tier, condition):
    base = CATEGORY_BASE.get(category, 20) + BRAND_BONUS.get(brand_tier, 0)
    multiplier = CONDITION_MULTIPLIER.get(condition, 1.0)
    return round(base * multiplier)
