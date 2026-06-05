'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, tenantApi } from '@/lib/api'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  tenantId: string
}

interface Tenant {
  id: string
  name: string
  vatNumber: string
  crNumber: string
  plan: string
}

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, tenant: null, loading: true,
  login: async () => {}, logout: () => {}, refresh: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserData = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) { setLoading(false); return }
    try {
      const [meRes, tenantRes] = await Promise.all([
        authApi.me(),
        tenantApi.get(),
      ])
      setUser(meRes.data.data)
      setTenant(tenantRes.data.data)
    } catch {
      localStorage.clear()
      document.cookie = 'accessToken=; path=/; max-age=0'
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUserData() }, [loadUserData])

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    const { accessToken, refreshToken } = res.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    document.cookie = `accessToken=${accessToken}; path=/; max-age=900`
    await loadUserData()
  }

  const logout = () => {
    authApi.logout().catch(() => {})
    localStorage.clear()
    document.cookie = 'accessToken=; path=/; max-age=0'
    setUser(null); setTenant(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, tenant, loading, login, logout, refresh: loadUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
