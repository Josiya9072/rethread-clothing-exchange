import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Landing from './pages/Landing.jsx'
import Browse from './pages/Browse.jsx'
import ItemDetail from './pages/ItemDetail.jsx'
import AddListing from './pages/AddListing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SwapChat from './pages/SwapChat.jsx'
import Admin from './pages/Admin.jsx'
import Auth from './pages/Auth.jsx'
import { useAuth } from './context/AuthContext.jsx'

function AppShell() {
  return (
    <>
      <Nav />
      <main className="wrap">
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return <div className="wrap" style={{ paddingTop: 40 }}><p className="hint">Loading…</p></div>
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/browse" element={<Browse />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/add" element={<AddListing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/swap/:id" element={<SwapChat />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Route>
    </Routes>
  )
}
