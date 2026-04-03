import { type FormEvent, useState } from 'react'

type Props = {
  onLogin: (identifier: string, password: string) => Promise<void>
}

export function LoginPage({ onLogin }: Props) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!identifier.trim() || !password) {
      setError('Введите логин или email и пароль')
      return
    }
    try {
      setSubmitting(true)
      await onLogin(identifier.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-center text-lg font-semibold text-slate-900">Admin Panel</h1>
        <p className="mt-1 text-center text-xs text-slate-500">Вход для администратора</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-center text-xs text-rose-700">
              {error}
            </div>
          )}
          <label className="block text-xs text-slate-600">
            Логин, email или телефон
            <input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block text-xs text-slate-600">
            Пароль
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
