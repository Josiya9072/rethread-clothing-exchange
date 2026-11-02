import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { STATUS_META } from '../components/ListingCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('mine')
  const [listings, setListings] = useState([])
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    Promise.all([api.myListings(), api.swaps()])
      .then(([l, s]) => {
        setListings(l.results || l)
        setSwaps(s.results || s)
      })
      .finally(() => setLoading(false))
  }, [user])

  async function handleDelist(id) {
    await api.deleteListing(id)
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  if (!user) return null
  if (loading) return <p className="hint" style={{ marginTop: 20 }}>Loading…</p>

  const incoming = swaps.filter((s) => s.owner.id === user.id)
  const outgoing = swaps.filter((s) => s.requester.id === user.id)

  function swapRow(s) {
    const status = STATUS_META[s.status] || STATUS_META.available
    const other = s.owner.id === user.id ? s.requester : s.owner
    return (
      <div className="list-row" key={s.id}>
        <div className="list-row-main">
          <div className="list-row-title">{s.listing_requested.title} &harr; {s.listing_offered.title}</div>
          <div className="list-row-sub">with {other.name} &middot; <span className={`tag-badge ${status.cls}`}>{s.status}</span></div>
        </div>
        <Link to={`/swap/${s.id}`} className="btn btn-small">Open</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Your dashboard</h1>
      <div className="tabs">
        <button className={'tab' + (tab === 'mine' ? ' active' : '')} onClick={() => setTab('mine')}>My listings</button>
        <button className={'tab' + (tab === 'incoming' ? ' active' : '')} onClick={() => setTab('incoming')}>Incoming requests</button>
        <button className={'tab' + (tab === 'outgoing' ? ' active' : '')} onClick={() => setTab('outgoing')}>Outgoing requests</button>
      </div>

      {tab === 'mine' && (
        listings.length ? (
          <div>
            {listings.map((l) => {
              const status = STATUS_META[l.status] || STATUS_META.available
              return (
                <div className="list-row" key={l.id}>
                  <div className="list-row-main">
                    <div className="list-row-title">{l.title}</div>
                    <div className="list-row-sub">{l.category} &middot; <span className={`tag-badge ${status.cls}`}>{status.label}</span></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/item/${l.id}`} className="btn btn-small">View</Link>
                    {l.status === 'available' && (
                      <button className="btn btn-small btn-danger" onClick={() => handleDelist(l.id)}>Delist</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty">
            <h3>Nothing listed yet</h3>
            <p>Add your first item to start swapping.</p>
            <Link to="/add" className="btn btn-primary">List an item</Link>
          </div>
        )
      )}

      {tab === 'incoming' && (
        incoming.length ? <div>{incoming.map(swapRow)}</div> : (
          <div className="empty"><h3>No requests yet</h3><p>When someone proposes a swap for your items, it shows up here.</p></div>
        )
      )}

      {tab === 'outgoing' && (
        outgoing.length ? <div>{outgoing.map(swapRow)}</div> : (
          <div className="empty">
            <h3>You haven't proposed any swaps</h3>
            <p>Browse listings and offer one of your items in trade.</p>
            <Link to="/browse" className="btn btn-primary">Browse items</Link>
          </div>
        )
      )}
    </div>
  )
}
