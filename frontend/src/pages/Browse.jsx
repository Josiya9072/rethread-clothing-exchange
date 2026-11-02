import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import ListingCard from '../components/ListingCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = [
  ['outerwear', 'Outerwear'], ['dress', 'Dress'], ['top', 'Top'],
  ['bottom', 'Bottom'], ['footwear', 'Footwear'], ['accessory', 'Accessory'],
]

export default function Browse() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('status', 'available')
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (sort === 'value-desc') { params.set('ordering', '-estimated_value') } else { params.set('ordering', '-created_at') }

    const timer = setTimeout(() => {
      api.listings(`?${params.toString()}`)
        .then((data) => {
          let results = data.results || data
          if (location) {
            results = results.filter((l) => l.location.toLowerCase().includes(location.toLowerCase()))
          }
          setListings(results)
        })
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [search, category, location, sort])

  return (
    <div>
      <h1>Trade what you're done with.</h1>
      <p className="center-note">Browse clothes people nearby are ready to swap. No prices, no listings that just sit there — propose a trade instead.</p>

      <div className="filters">
        <div className="field">
          <label>Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Denim, dress, boots..." />
        </div>
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City" />
        </div>
        <div className="field">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="value-desc">Highest value</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="hint" style={{ marginTop: 20 }}>Loading listings…</p>
      ) : listings.length ? (
        <div className="grid">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      ) : (
        <div className="empty">
          <h3>No items match yet</h3>
          <p>Try a different filter, or list something of your own.</p>
          {user && <Link to="/add" className="btn btn-primary">List an item</Link>}
        </div>
      )}
    </div>
  )
}
