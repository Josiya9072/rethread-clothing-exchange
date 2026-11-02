import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Auth() {
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const email = e.target.email.value.trim()
    const password = e.target.password.value
    try {
      await login(email, password)
      navigate('/browse')
    } catch (err) {
      setError('No account matches that email and password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      name: e.target.name.value.trim(),
      email: e.target.email.value.trim(),
      password: e.target.password.value,
      location: e.target.location.value.trim(),
    }
    try {
      await register(payload)
      navigate('/browse')
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Sign in to ReThread</h1>
      <div className="tabs">
        <button className={'tab' + (tab === 'login' ? ' active' : '')} onClick={() => setTab('login')}>Sign in</button>
        <button className={'tab' + (tab === 'register' ? ' active' : '')} onClick={() => setTab('register')}>Create account</button>
      </div>
      {error && <div className="msg-banner msg-error">{error}</div>}

      {tab === 'login' ? (
        <form onSubmit={handleLogin} style={{ maxWidth: 380, marginTop: 16 }}>
          <div className="field"><label>Email</label><input type="email" name="email" required /></div>
          <div className="field"><label>Password</label><input type="password" name="password" required /></div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Sign in</button>
          <p className="hint">Try a demo account: meera@example.com / seed12345</p>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={{ maxWidth: 380, marginTop: 16 }}>
          <div className="field"><label>Name</label><input type="text" name="name" required /></div>
          <div className="field"><label>Email</label><input type="email" name="email" required /></div>
          <div className="field"><label>Password</label><input type="password" name="password" minLength={6} required /></div>
          <div className="field"><label>Location</label><input type="text" name="location" placeholder="City" required /></div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Create account</button>
        </form>
      )}
    </div>
  )
}
