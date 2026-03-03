import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type User = {
  id: number
  login: string
  email: string
  last_name: string
  first_name: string
  middle_name: string
  phone: string
  city: string
  street: string
  house: string
  apartment: string
  is_blocked: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

type UserForm = {
  login: string
  email: string
  password: string
  last_name: string
  first_name: string
  middle_name: string
  phone: string
  city: string
  street: string
  house: string
  apartment: string
  is_blocked: boolean
  is_admin: boolean
}

type Category = {
  id: number
  name: string
  slug: string
  isPublished: boolean
}

const categories: Category[] = [
  { id: 1, name: 'Парковки', slug: 'parkings', isPublished: true },
  { id: 2, name: 'Просроченные продукты', slug: 'expired-products', isPublished: false },
]

type View = 'users' | 'categories'

const API_URL = 'http://localhost:8080'

function App() {
  const [view, setView] = useState<View>('users')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState<UserForm>({
    login: '',
    email: '',
    password: '',
    last_name: '',
    first_name: '',
    middle_name: '',
    phone: '',
    city: '',
    street: '',
    house: '',
    apartment: '',
    is_blocked: false,
    is_admin: false,
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch(`${API_URL}/v1/users`)
        if (!res.ok) {
          throw new Error(`Ошибка загрузки: ${res.status}`)
        }
        const data = (await res.json()) as User[]
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить пользователей')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Удалить пользователя?')) return

    try {
      const res = await fetch(`${API_URL}/v1/users/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('Не удалось удалить пользователя')
      }
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления')
    }
  }

  const startCreateUser = () => {
    // Тоггл формы создания: если уже открыта, закрываем, иначе открываем
    if (isCreating) {
      cancelEdit()
      return
    }

    setEditingUser(null)
    setIsCreating(true)
    setFormError(null)
    setUserForm({
      login: '',
      email: '',
      password: '',
      last_name: '',
      first_name: '',
      middle_name: '',
      phone: '',
      city: '',
      street: '',
      house: '',
      apartment: '',
      is_blocked: false,
      is_admin: false,
    })
  }

  const startEditUser = (user: User) => {
    setIsCreating(false)
    setEditingUser(user)
    setFormError(null)
    setUserForm({
      login: user.login,
      email: user.email,
      password: '',
      last_name: user.last_name,
      first_name: user.first_name,
      middle_name: user.middle_name,
      phone: user.phone,
      city: user.city,
      street: user.street,
      house: user.house,
      apartment: user.apartment,
      is_blocked: user.is_blocked,
      is_admin: user.is_admin,
    })
  }

  const handleEditUser = (user: User) => {
    // Тоггл редактирования: повторный клик по тому же пользователю закрывает форму
    if (editingUser && editingUser.id === user.id) {
      cancelEdit()
      return
    }

    startEditUser(user)
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setIsCreating(false)
    setFormError(null)
    setIsSaving(false)
  }

  const handleFormChange = (field: keyof UserForm, value: string | boolean) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitUser = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (
      !userForm.login ||
      !userForm.email ||
      (!editingUser && !userForm.password) ||
      !userForm.last_name ||
      !userForm.first_name ||
      !userForm.phone ||
      !userForm.city ||
      !userForm.street ||
      !userForm.house
    ) {
      setFormError('Нужно заполнить все обязательные поля')
      return
    }

    try {
      setIsSaving(true)

      if (isCreating) {
        const res = await fetch(`${API_URL}/v1/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: userForm.login,
            email: userForm.email,
            password: userForm.password,
            last_name: userForm.last_name,
            first_name: userForm.first_name,
            middle_name: userForm.middle_name,
            phone: userForm.phone,
            city: userForm.city,
            street: userForm.street,
            house: userForm.house,
            apartment: userForm.apartment,
            is_blocked: userForm.is_blocked,
            is_admin: userForm.is_admin,
          }),
        })

        if (!res.ok) {
          throw new Error('Не удалось создать пользователя')
        }

        const created = (await res.json()) as User
        setUsers((prev) => [...prev, created])
        cancelEdit()
      } else if (editingUser) {
        const res = await fetch(`${API_URL}/v1/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: userForm.login,
            email: userForm.email,
            last_name: userForm.last_name,
            first_name: userForm.first_name,
            middle_name: userForm.middle_name,
            phone: userForm.phone,
            city: userForm.city,
            street: userForm.street,
            house: userForm.house,
            apartment: userForm.apartment,
            is_blocked: userForm.is_blocked,
            is_admin: userForm.is_admin,
          }),
        })

        if (!res.ok) {
          throw new Error('Не удалось обновить пользователя')
        }

        const updated = (await res.json()) as User
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
        cancelEdit()
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Admin Panel
            </h1>
            <p className="text-sm text-slate-500">
              Управление пользователями и рубриками
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        {/* Sidebar */}
        <aside className="w-44 shrink-0">
          <nav className="space-y-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Разделы
            </p>
            <button
              type="button"
              onClick={() => setView('users')}
              className={
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ' +
                (view === 'users'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50')
              }
            >
              <span>Пользователи</span>
              <span className="text-[11px] opacity-75">{users.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setView('categories')}
              className={
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ' +
                (view === 'categories'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50')
              }
            >
              <span>Рубрики</span>
              <span className="text-[11px] opacity-75">{categories.length}</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1">
          {view === 'users' ? (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Пользователи
                  </h2>
                  <p className="text-xs text-slate-500">
                    Список зарегистрированных пользователей системы
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isLoading && (
                    <span className="text-[11px] text-slate-400">Загрузка...</span>
                  )}
                  {error && (
                    <span className="text-[11px] text-rose-500">Ошибка: {error}</span>
                  )}
                  <button
                    type="button"
                    onClick={startCreateUser}
                    className="h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-medium text-white shadow-sm hover:bg-slate-800 inline-flex"
                  >
                    + Добавить
                  </button>
                </div>
              </div>
              {(isCreating || editingUser) && (
                <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {isCreating ? 'Создание пользователя' : 'Редактирование пользователя'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Поля с * обязательны для заполнения
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100"
                    >
                      Отмена
                    </button>
                  </div>
                  {formError && (
                    <div className="mb-3 rounded-md bg-rose-50 px-3 py-2 text-[11px] text-rose-600">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleSubmitUser} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Логин *
                      <input
                        type="text"
                        value={userForm.login}
                        onChange={(e) => handleFormChange('login', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Email *
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    {isCreating && (
                      <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                        Пароль *
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => handleFormChange('password', e.target.value)}
                          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                      </label>
                    )}
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Фамилия *
                      <input
                        type="text"
                        value={userForm.last_name}
                        onChange={(e) => handleFormChange('last_name', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Имя *
                      <input
                        type="text"
                        value={userForm.first_name}
                        onChange={(e) => handleFormChange('first_name', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Отчество
                      <input
                        type="text"
                        value={userForm.middle_name}
                        onChange={(e) => handleFormChange('middle_name', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Телефон *
                      <input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Город *
                      <input
                        type="text"
                        value={userForm.city}
                        onChange={(e) => handleFormChange('city', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Улица *
                      <input
                        type="text"
                        value={userForm.street}
                        onChange={(e) => handleFormChange('street', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Дом *
                      <input
                        type="text"
                        value={userForm.house}
                        onChange={(e) => handleFormChange('house', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                      Квартира
                      <input
                        type="text"
                        value={userForm.apartment}
                        onChange={(e) => handleFormChange('apartment', e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </label>
                    <div className="flex flex-col justify-end gap-2 text-[11px] text-slate-600">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={userForm.is_admin}
                          onChange={(e) => handleFormChange('is_admin', e.target.checked)}
                          className="h-3 w-3 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                        />
                        Администратор
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={userForm.is_blocked}
                          onChange={(e) => handleFormChange('is_blocked', e.target.checked)}
                          className="h-3 w-3 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                        />
                        Заблокирован
                      </label>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving
                          ? 'Сохранение...'
                          : isCreating
                            ? 'Создать пользователя'
                            : 'Сохранить изменения'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <div className="max-h-[360px] overflow-auto">
                  <table className="min-w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-medium">ID</th>
                        <th className="px-3 py-2 font-medium">Логин</th>
                        <th className="px-3 py-2 font-medium">Email</th>
                        <th className="px-3 py-2 font-medium">Роль</th>
                        <th className="px-3 py-2 font-medium">Статус</th>
                        <th className="px-3 py-2 text-right font-medium">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/70">
                          <td className="px-3 py-2">{user.id}</td>
                          <td className="px-3 py-2">{user.login}</td>
                          <td className="px-3 py-2">{user.email}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700">
                              {user.is_admin ? 'Админ' : 'Пользователь'}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={
                                'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                                (!user.is_blocked
                                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                                  : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100')
                              }
                            >
                              {!user.is_blocked ? 'Активен' : 'Заблокирован'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditUser(user)}
                                className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                              >
                                Редактировать
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id)}
                                className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!isLoading && users.length === 0 && !error && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-3 py-4 text-center text-xs text-slate-400"
                          >
                            Пользователи не найдены
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                  <span>Всего: {users.length}</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Рубрики
                </h2>
                <p className="text-xs text-slate-500">
                  Управление рубриками/категориями контента
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="h-8 w-32 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-40"
                />
                <button className="hidden h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-medium text-white shadow-sm hover:bg-slate-800 sm:inline-flex">
                  + Добавить
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <div className="max-h-[360px] overflow-auto">
                <table className="min-w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Название</th>
                      <th className="px-3 py-2 font-medium">Slug</th>
                      <th className="px-3 py-2 font-medium">Статус</th>
                      <th className="px-3 py-2 text-right font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-slate-50/70">
                        <td className="px-3 py-2">{category.id}</td>
                        <td className="px-3 py-2">{category.name}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {category.slug}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                              (category.isPublished
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200')
                            }
                          >
                            {category.isPublished ? 'Опубликована' : 'Черновик'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                              Редактировать
                            </button>
                            <button className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50">
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                <span>Всего: {categories.length}</span>
              </div>
            </div>
          </section>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
