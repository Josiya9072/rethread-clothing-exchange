import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function TagMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L12 3H21C22.1 3 23 3.9 23 5V14L14 23C13.2 23.8 11.8 23.8 11 23L3 15C2.2 14.2 2.2 12.8 3 12Z" stroke="var(--thread)" strokeWidth="1.6" fill="var(--card)" />
      <circle cx="16.5" cy="9.5" r="2" stroke="var(--thread)" strokeWidth="1.6" fill="none" />
    </svg>
  )
}

export default function Nav() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const links = [['/browse', 'Browse']]
  if (user) {
    links.push(['/add', 'List an item'])
    links.push(['/dashboard', 'Dashboard'])
  }
  if (user?.is_staff) links.push(['/admin', 'Admin'])

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to="/browse" className="brand"><TagMark /> ReThread</Link>
        <div className="nav-links">
          {links.map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className={'nav-link' + (location.pathname.startsWith(href) ? ' active' : '')}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="who">Signed in as {user.name}</span>
              <button className="btn btn-small" onClick={logout}>Sign out</button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-small">Sign in</Link>
          )}
        </div>
      </div>
    </div>
  )
}
