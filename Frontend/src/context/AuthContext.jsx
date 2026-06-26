import { createContext, useState, useEffect, useCallback } from 'react'
import { getMe, logout as logoutService } from '../services/auth.service'

/**
 * AuthContext — provides user state, loading, and auth actions
 * throughout the entire application.
 */
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true while checking auth on mount

  // ── Auto-login check on app load ─────────────────────────────────────────
  // Calls GET /rest/onboardings/me — if cookie is valid, returns user; else 401
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getMe()
        setUser(currentUser)
      } catch {
        // 401 or network error — user is not logged in
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await logoutService()
    } catch {
      // ignore errors — clear state regardless
    } finally {
      setUser(null)
    }
  }, [])

  // ── Update user (e.g. after role change) ─────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getMe()
      setUser(currentUser)
    } catch {
      setUser(null)
    }
  }, [])

  const value = { user, loading, login, logout, refreshUser }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
