import React from 'react'
import { Link } from 'react-router-dom'

const CATEGORY_LABELS = {
  outerwear: 'Outerwear', dress: 'Dress', top: 'Top',
  bottom: 'Bottom', footwear: 'Footwear', accessory: 'Accessory',
}
const CONDITION_LABELS = {
  new_with_tags: 'New with tags', like_new: 'Like new', good: 'Good', fair: 'Fair',
}
const STATUS_META = {
  available: { cls: 'badge-available', label: 'Available' },
  pending: { cls: 'badge-pending', label: 'Requested' },
  swapped: { cls: 'badge-swapped', label: 'Swapped' },
}

export default function ListingCard({ listing, clickable = true }) {
  const status = STATUS_META[listing.status] || STATUS_META.available
  const inner = (
    <>
      <div className="tag-hole" />
      <div className="tag-code mono">RT-{String(listing.id).padStart(4, '0')}</div>
      <div className="tag-title">{listing.title}</div>
      <div className="tag-meta">
        {CATEGORY_LABELS[listing.category] || listing.category} &middot; size {listing.size} &middot; {CONDITION_LABELS[listing.condition] || listing.condition}
      </div>
      <div className="tag-meta">{listing.location} &middot; listed by {listing.owner?.name}</div>
      <span className={`tag-badge ${status.cls}`}>{status.label}</span>
      <div className="tag-value mono">est. value {listing.estimated_value} pts</div>
    </>
  )

  if (!clickable) {
    return <div className="tag-card">{inner}</div>
  }
  return (
    <Link to={`/item/${listing.id}`} className="tag-card">
      {inner}
    </Link>
  )
}

export { CATEGORY_LABELS, CONDITION_LABELS, STATUS_META }
