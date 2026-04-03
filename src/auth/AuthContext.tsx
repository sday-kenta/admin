import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { API_URL } from '../config'
import type { User } from '../App'
import { clearSession, readSession, writeSession, type AuthSession } from './session'

type AuthContextValue = {
  session: AuthSession | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(readSession())
    setLoading(false)
  }, [])

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await fetch(`${API_URL}/v1/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: identifier.trim(), password }),
    })

    const data = (await res.json().catch(() => ({}))) as User & { error?: string }

    if (!res.ok) {
      throw new Error(data.error || 'Не удалось войти')
    }

    const user = data as User
    if (user.role !== 'admin') {
      throw new Error('Доступ к панели только у администратора')
    }
    if (user.is_blocked) {
      throw new Error('Учётная запись заблокирована')
    }

    const next: AuthSession = {
      userId: user.id,
      role: user.role,
      login: user.login,
    }
    writeSession(next)
    setSession(next)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, loading, login, logout }),
    [session, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
