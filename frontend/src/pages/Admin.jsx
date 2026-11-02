import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'
const DJANGO_ADMIN_URL = API_BASE.replace(/\/api\/?$/, '/admin/')

export default function Admin() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.is_staff) return
    api.adminStats().then(setStats).catch((e) => setError(e.message))
  }, [user])

  if (!user?.is_staff) {
    return (
      <div className="empty">
        <h3>Admins only</h3>
        <p>You don't have access to this page.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Admin panel</h1>
      <p className="center-note">
        Platform-wide moderation (removing users, listings, or swaps) happens in the Django admin site.{' '}
        <a href={DJANGO_ADMIN_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--thread)' }}>
          Open Django admin &rarr;
        </a>
      </p>

      {error && <div className="msg-banner msg-error">{error}</div>}

      {stats && (
        <>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num">{stats.users}</div><div className="stat-label">Users</div></div>
            <div className="stat-card"><div className="stat-num">{stats.listings}</div><div className="stat-label">Listings</div></div>
            <div className="stat-card"><div className="stat-num">{stats.swap_requests}</div><div className="stat-label">Swap requests</div></div>
            <div className="stat-card"><div className="stat-num">{stats.completed_swaps}</div><div className="stat-label">Completed swaps</div></div>
          </div>

          <div className="section-title"><h2>Recently joined</h2></div>
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Location</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {stats.recent_users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}{u.is_staff && <span className="tag-badge badge-available" style={{ marginLeft: 6 }}>admin</span>}</td>
                  <td>{u.email}</td>
                  <td>{u.location}</td>
                  <td>{new Date(u.date_joined).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
