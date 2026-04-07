const STORAGE_KEY = 'admin-panel-session'

export type AuthSession = {
  userId: number
  role: string
  login: string
  accessToken: string
  tokenType: string
  expiresAt: string
}

export function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as AuthSession
    if (typeof s.userId !== 'number' || !s.role || !s.login) return null
    if (!s.accessToken || !s.tokenType || !s.expiresAt) return null
    if (s.role !== 'admin') return null
    return s
  } catch {
    return null
  }
}

export function writeSession(s: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuthHeaders(): Record<string, string> {
  const s = readSession()
  if (!s) return {}
  return {
    Authorization: `${s.tokenType} ${s.accessToken}`,
  }
}
