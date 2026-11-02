import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = [
  ['outerwear', 'Outerwear'], ['dress', 'Dress'], ['top', 'Top'],
  ['bottom', 'Bottom'], ['footwear', 'Footwear'], ['accessory', 'Accessory'],
]
const BRAND_TIERS = [
  ['premium', 'Premium'], ['mid_range', 'Mid-range'], ['budget', 'Budget / unbranded'],
]
const CONDITIONS = [
  ['new_with_tags', 'New with tags'], ['like_new', 'Like new'], ['good', 'Good'], ['fair', 'Fair'],
]

export default function AddListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', category: 'outerwear', size: '', brand_tier: 'mid_range',
    condition: 'good', location: user?.location || '', note: '',
  })
  const [preview, setPreview] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) navigate('/auth')
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      api.valuePreview({ category: form.category, brand_tier: form.brand_tier, condition: form.condition })
        .then((data) => setPreview(data.estimated_value))
        .catch(() => {})
    }, 150)
    return () => clearTimeout(timer)
  }, [form.category, form.brand_tier, form.condition])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const listing = await api.createListing(form)
      navigate(`/item/${listing.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return null

  return (
    <div>
      <h1>List an item</h1>
      <p className="center-note">Give it a clear title and honest condition — the estimated value updates as you fill this in.</p>
      {error && <div className="msg-banner msg-error">{error}</div>}
      <form onSubmit={submit} style={{ maxWidth: 520, marginTop: 20 }}>
        <div className="field">
          <label>Title</label>
          <input type="text" value={form.title} onChange={update('title')} placeholder="e.g. Corduroy overshirt" required />
        </div>
        <div className="row2">
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={update('category')}>
              {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Size</label>
            <input type="text" value={form.size} onChange={update('size')} placeholder="M / UK 8 / One size" required />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Brand tier</label>
            <select value={form.brand_tier} onChange={update('brand_tier')}>
              {BRAND_TIERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Condition</label>
            <select value={form.condition} onChange={update('condition')}>
              {CONDITIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Location</label>
          <input type="text" value={form.location} onChange={update('location')} required />
        </div>
        <div className="field">
          <label>Notes (optional)</label>
          <textarea value={form.note} onChange={update('note')} placeholder="Fit, flaws, why you're letting it go..." />
        </div>
        <div className="field">
          <label>Estimated value</label>
          <div className="tag-value mono">{preview} pts</div>
          <div className="hint">Calculated from category, brand tier, and condition.</div>
        </div>
        <button type="submit" className="btn btn-primary">Publish listing</button>
      </form>
    </div>
  )
}
