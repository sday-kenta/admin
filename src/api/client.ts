import { API_URL } from '../config'
import { getAuthHeaders } from '../auth/session'

/**
 * Запрос к API с подстановкой X-User-ID / X-User-Role из сохранённой сессии.
 * Путь вида `/v1/users` (без базового URL).
 */
export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith('http')
    ? path
    : `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init?.headers)
  for (const [k, v] of Object.entries(getAuthHeaders())) {
    if (!headers.has(k)) {
      headers.set(k, v)
    }
  }
  return fetch(url, { ...init, headers })
}
