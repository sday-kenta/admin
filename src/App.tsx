import { useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'blocked'
}

type Category = {
  id: number
  name: string
  slug: string
  isPublished: boolean
}

const users: User[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Анна Смирнова', email: 'anna@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Дмитрий Орлов', email: 'dmitry@example.com', role: 'user', status: 'blocked' },
]

const categories: Category[] = [
  { id: 1, name: 'Парковки', slug: 'parkings', isPublished: true },
  { id: 2, name: 'Просроченные продукты', slug: 'expired-products', isPublished: false },
]

type View = 'users' | 'categories'

function App() {
  const [view, setView] = useState<View>('users')

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
                      <th className="px-3 py-2 font-medium">Имя</th>
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
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                              (user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100')
                            }
                          >
                            {user.status === 'active' ? 'Активен' : 'Заблокирован'}
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
