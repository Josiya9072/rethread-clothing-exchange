import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Browse from './pages/Browse.jsx'
import ItemDetail from './pages/ItemDetail.jsx'
import AddListing from './pages/AddListing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SwapChat from './pages/SwapChat.jsx'
import Admin from './pages/Admin.jsx'
import Auth from './pages/Auth.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return <div className="wrap" style={{ paddingTop: 40 }}><p className="hint">Loading…</p></div>
  }

  return (
    <>
      <Nav />
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/add" element={<AddListing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/swap/:id" element={<SwapChat />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/browse" replace />} />
        </Routes>
      </main>
    </>
  )
}
