import type { FormEvent } from 'react'
import type { User, UserForm } from '../App'

type Props = {
  users: User[]
  isLoading: boolean
  error: string | null
  formError: string | null
  isSaving: boolean
  isCreating: boolean
  editingUser: User | null
  userToDelete: User | null
  isDeleting: boolean
  userForm: UserForm
  onStartCreate: () => void
  onCancelEdit: () => void
  onEditUser: (user: User) => void
  onRequestDelete: (user: User) => void
  onCancelDelete: () => void
  onConfirmDelete: () => Promise<void>
  onFormChange: (field: keyof UserForm, value: string | boolean) => void
  onSubmit: (event: FormEvent) => Promise<void>
}

export function UsersSection({
  users,
  isLoading,
  error,
  formError,
  isSaving,
  isCreating,
  editingUser,
  userToDelete,
  isDeleting,
  userForm,
  onStartCreate,
  onCancelEdit,
  onEditUser,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onFormChange,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Пользователи</h2>
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
            onClick={onStartCreate}
            className="h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-medium text-white shadow-sm hover:bg-slate-800 inline-flex"
          >
            + Добавить
          </button>
        </div>
      </div>
      {userToDelete && (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-[11px] text-rose-800">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold">
                Удалить пользователя #{userToDelete.id} ({userToDelete.login})?
              </p>
              <p className="text-[11px] text-rose-700">
                Действие необратимо. Все данные пользователя будут удалены.
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelDelete}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
            >
              Отмена
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="inline-flex h-7 items-center justify-center rounded-md bg-rose-600 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Удаление...' : 'Да, удалить'}
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              className="inline-flex h-7 items-center justify-center rounded-md border border-rose-200 px-3 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
            >
              Отменить
            </button>
          </div>
        </div>
      )}
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
              onClick={onCancelEdit}
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
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Логин *
              <input
                type="text"
                value={userForm.login}
                onChange={(e) => onFormChange('login', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Email *
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            {isCreating && (
              <label className="flex flex-col gap-1 text-[11px] text-slate-600">
                Пароль *
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
            )}
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Фамилия *
              <input
                type="text"
                value={userForm.last_name}
                onChange={(e) => onFormChange('last_name', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Имя *
              <input
                type="text"
                value={userForm.first_name}
                onChange={(e) => onFormChange('first_name', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Отчество
              <input
                type="text"
                value={userForm.middle_name}
                onChange={(e) => onFormChange('middle_name', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Телефон *
              <input
                type="tel"
                value={userForm.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Город *
              <input
                type="text"
                value={userForm.city}
                onChange={(e) => onFormChange('city', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Улица *
              <input
                type="text"
                value={userForm.street}
                onChange={(e) => onFormChange('street', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Дом *
              <input
                type="text"
                value={userForm.house}
                onChange={(e) => onFormChange('house', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              Квартира
              <input
                type="text"
                value={userForm.apartment}
                onChange={(e) => onFormChange('apartment', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <div className="flex flex-col justify-end gap-2 text-[11px] text-slate-600">
              <label className="flex flex-col gap-1">
                Роль
                <select
                  value={userForm.role}
                  onChange={(e) => onFormChange('role', e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Админ</option>
                  <option value="premium">Премиум</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userForm.is_blocked}
                  onChange={(e) => onFormChange('is_blocked', e.target.checked)}
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
                      {user.role === 'admin'
                        ? 'Админ'
                        : user.role === 'premium'
                          ? 'Премиум'
                          : 'Пользователь'}
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
                        onClick={() => onEditUser(user)}
                        className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestDelete(user)}
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
  )
}

