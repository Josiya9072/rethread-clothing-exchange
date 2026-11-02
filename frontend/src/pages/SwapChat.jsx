import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import ListingCard from '../components/ListingCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function SwapArrow() {
  return (
    <svg className="swap-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8H18M18 8L14 4M18 8L14 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16H6M6 16L10 12M6 16L10 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SwapChat() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [swap, setSwap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const threadRef = useRef(null)

  function load() {
    return api.swap(id).then(setSwap)
  }

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    setLoading(true)
    load().catch(() => setSwap(null)).finally(() => setLoading(false))
  }, [id, user])

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [swap])

  async function act(action) {
    setError('')
    try {
      const updated = await action()
      setSwap(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!message.trim()) return
    try {
      await api.sendMessage(id, message.trim())
      setMessage('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return null
  if (loading) return <p className="hint" style={{ marginTop: 20 }}>Loading…</p>
  if (!swap) return <div className="empty"><h3>Swap not found</h3></div>

  const isOwner = user.id === swap.owner.id
  const target = swap.listing_requested
  const offered = swap.listing_offered
  const maxVal = Math.max(target.estimated_value, offered.estimated_value, 1)
  const diff = Math.abs(target.estimated_value - offered.estimated_value)
  const fairness = diff <= 8 ? 'This looks like a fair trade in value.' : "Values differ a fair bit — worth discussing in chat."

  let actions = null
  if (swap.status === 'pending' && isOwner) {
    actions = (
      <>
        <button className="btn btn-primary" onClick={() => act(() => api.acceptSwap(id))}>Accept swap</button>{' '}
        <button className="btn btn-danger" onClick={() => act(() => api.rejectSwap(id))}>Decline</button>
      </>
    )
  } else if (swap.status === 'accepted') {
    actions = <button className="btn btn-primary" onClick={() => act(() => api.completeSwap(id))}>Mark swap complete</button>
  } else if (swap.status === 'pending' && !isOwner) {
    actions = <p className="hint">Waiting for {swap.owner.name} to respond.</p>
  } else if (swap.status === 'completed') {
    actions = <span className="tag-badge badge-swapped">Swap completed</span>
  } else if (swap.status === 'rejected') {
    actions = <span className="tag-badge badge-swapped">Swap declined</span>
  }

  return (
    <div>
      <div style={{ marginTop: 16 }}>
        <Link to="/dashboard" style={{ color: 'var(--ink-soft)', fontSize: 13 }}>&larr; Back to dashboard</Link>
      </div>
      <h1>Swap details</h1>
      {error && <div className="msg-banner msg-error">{error}</div>}

      <div className="swap-pair">
        <ListingCard listing={target} clickable={false} />
        <SwapArrow />
        <ListingCard listing={offered} clickable={false} />
      </div>

      <div className="value-compare">
        <div>
          <div className="hint">their item</div>
          <div className="value-bar-track"><div className="value-bar-fill" style={{ width: `${Math.round((target.estimated_value / maxVal) * 100)}%` }} /></div>
          <div className="mono" style={{ fontSize: 12 }}>{target.estimated_value} pts</div>
        </div>
        <div>
          <div className="hint">your item</div>
          <div className="value-bar-track"><div className="value-bar-fill" style={{ width: `${Math.round((offered.estimated_value / maxVal) * 100)}%` }} /></div>
          <div className="mono" style={{ fontSize: 12 }}>{offered.estimated_value} pts</div>
        </div>
      </div>
      <p className="hint">{fairness}</p>

      <div style={{ margin: '16px 0' }}>{actions}</div>

      <hr className="divider" />
      <h3>Chat</h3>
      <div className="chat-thread" ref={threadRef}>
        {swap.messages.length ? swap.messages.map((m) => (
          <div key={m.id} className={'bubble ' + (m.sender.id === user.id ? 'bubble-mine' : 'bubble-theirs')}>
            {m.text}
            <div className="bubble-meta">{m.sender.name} &middot; {new Date(m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
          </div>
        )) : <p className="hint">No messages yet. Say hello.</p>}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message..." autoComplete="off" required />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  )
}
