const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'

function getTokens() {
  return {
    access: localStorage.getItem('rethread_access'),
    refresh: localStorage.getItem('rethread_refresh'),
  }
}

function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('rethread_access', access)
  if (refresh) localStorage.setItem('rethread_refresh', refresh)
}

function clearTokens() {
  localStorage.removeItem('rethread_access')
  localStorage.removeItem('rethread_refresh')
}

async function refreshAccessToken() {
  const { refresh } = getTokens()
  if (!refresh) return null
  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (!res.ok) {
    clearTokens()
    return null
  }
  const data = await res.json()
  setTokens({ access: data.access })
  return data.access
}

async function request(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const { access } = getTokens()
    if (access) headers['Authorization'] = `Bearer ${access}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth && retry) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      return request(path, { method, body, auth, retry: false })
    }
  }

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message =
      (data && (data.detail || Object.values(data).flat().join(' '))) ||
      `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  register: (payload) => request('/auth/register/', { method: 'POST', body: payload, auth: false }),
  login: async (payload) => {
    const data = await request('/auth/login/', { method: 'POST', body: payload, auth: false })
    setTokens({ access: data.access, refresh: data.refresh })
    return data.user
  },
  logout: () => clearTokens(),
  me: () => request('/auth/me/'),

  listings: (params = '') => request(`/listings/${params}`, { auth: false }),
  listing: (id) => request(`/listings/${id}/`, { auth: false }),
  createListing: (payload) => request('/listings/', { method: 'POST', body: payload }),
  deleteListing: (id) => request(`/listings/${id}/`, { method: 'DELETE' }),
  myListings: () => request('/listings/?mine=true'),
  valuePreview: (payload) => request('/listings/value-preview/', { method: 'POST', body: payload, auth: false }),

  swaps: () => request('/swaps/'),
  swap: (id) => request(`/swaps/${id}/`),
  createSwap: (payload) => request('/swaps/', { method: 'POST', body: payload }),
  acceptSwap: (id) => request(`/swaps/${id}/accept/`, { method: 'POST' }),
  rejectSwap: (id) => request(`/swaps/${id}/reject/`, { method: 'POST' }),
  completeSwap: (id) => request(`/swaps/${id}/complete/`, { method: 'POST' }),
  sendMessage: (id, text) => request(`/swaps/${id}/send_message/`, { method: 'POST', body: { text } }),

  adminStats: () => request('/admin/stats/'),

  hasSession: () => !!getTokens().access,
}
