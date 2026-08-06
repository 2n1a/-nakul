import { useState, useEffect } from 'react'
import { isAdminAuthenticated } from '../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated())

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated())
  }, [])

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
}
