import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import ListingCard, { CATEGORY_LABELS, CONDITION_LABELS, STATUS_META } from '../components/ListingCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [myItems, setMyItems] = useState([])
  const [offerId, setOfferId] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.listing(id).then(setListing).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (user) {
      api.myListings().then((data) => {
        const results = (data.results || data).filter((l) => l.status === 'available')
        setMyItems(results)
        if (results.length) setOfferId(String(results[0].id))
      })
    }
  }, [user])

  async function submitSwap(e) {
    e.preventDefault()
    setError('')
    try {
      const swap = await api.createSwap({
        listing_requested_id: Number(id),
        listing_offered_id: Number(offerId),
      })
      if (note.trim()) {
        await api.sendMessage(swap.id, note.trim())
      }
      navigate(`/swap/${swap.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="hint" style={{ marginTop: 20 }}>Loading…</p>
  if (!listing) {
    return (
      <div className="empty">
        <h3>Item not found</h3>
        <p>It may have been removed.</p>
        <Link to="/browse" className="btn">Back to browse</Link>
      </div>
    )
  }

  const mine = user && listing.owner.id === user.id
  const status = STATUS_META[listing.status] || STATUS_META.available

  let actionArea
  if (!user) {
    actionArea = (
      <div className="empty">
        <h3>Sign in to propose a swap</h3>
        <p>Create a free account to offer one of your items in trade.</p>
        <Link to="/auth" className="btn btn-primary">Sign in</Link>
      </div>
    )
  } else if (mine) {
    actionArea = (
      <div className="empty">
        <h3>This is your listing</h3>
        <p>Manage it from your dashboard.</p>
        <Link to="/dashboard" className="btn">Go to dashboard</Link>
      </div>
    )
  } else if (listing.status !== 'available') {
    actionArea = (
      <div className="empty">
        <h3>Not available right now</h3>
        <p>This item already has a swap in progress.</p>
      </div>
    )
  } else if (!myItems.length) {
    actionArea = (
      <div className="empty">
        <h3>List an item first</h3>
        <p>You need at least one available item to offer in trade.</p>
        <Link to="/add" className="btn btn-primary">List an item</Link>
      </div>
    )
  } else {
    actionArea = (
      <form onSubmit={submitSwap}>
        <h3>Propose a swap</h3>
        {error && <div className="msg-banner msg-error">{error}</div>}
        <div className="field">
          <label>Offer one of your items</label>
          <select value={offerId} onChange={(e) => setOfferId(e.target.value)}>
            {myItems.map((l) => (
              <option key={l.id} value={l.id}>{l.title} (est. {l.estimated_value} pts)</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Add a note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Happy to meet near Beach Road, or ship it your way." />
        </div>
        <button type="submit" className="btn btn-primary">Send swap request</button>
      </form>
    )
  }

  return (
    <div>
      <div style={{ marginTop: 16 }}>
        <Link to="/browse" style={{ color: 'var(--ink-soft)', fontSize: 13 }}>&larr; Back to browse</Link>
      </div>
      <div className="detail-hero">
        <div className="swatch">{CATEGORY_LABELS[listing.category] || listing.category}</div>
        <div>
          <div className="tag-code mono">RT-{String(listing.id).padStart(4, '0')}</div>
          <h1>{listing.title}</h1>
          <span className={`tag-badge ${status.cls}`}>{status.label}</span>
          <p style={{ marginTop: 14, color: 'var(--ink-soft)' }}>
            {CATEGORY_LABELS[listing.category]} &middot; size {listing.size} &middot; {listing.brand_tier.replace('_', ' ')} &middot; {CONDITION_LABELS[listing.condition]}
          </p>
          <p style={{ color: 'var(--ink-soft)' }}>{listing.location} &middot; listed by {listing.owner.name}</p>
          {listing.note && <p style={{ marginTop: 10 }}>{listing.note}</p>}
          <p className="tag-value mono" style={{ marginTop: 14 }}>estimated value: {listing.estimated_value} pts</p>
        </div>
      </div>
      <hr className="divider" />
      {actionArea}
    </div>
  )
}
