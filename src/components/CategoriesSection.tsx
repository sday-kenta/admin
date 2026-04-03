import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, CategoryForm } from '../App'

function filterCategoriesBySearch(categories: Category[], query: string): Category[] {
  const q = query.trim().toLowerCase()
  if (!q) return categories
  return categories.filter((cat) => {
    const blob = [String(cat.id), cat.title, cat.icon_url ?? ''].join(' ').toLowerCase()
    return blob.includes(q)
  })
}

type Props = {
  categories: Category[]
  categoryError: string | null
  formError: string | null
  isSavingCategory: boolean
  isCreatingCategory: boolean
  editingCategory: Category | null
  categoryToDelete: Category | null
  isDeletingCategory: boolean
  categoryForm: CategoryForm
  onStartCreate: () => void
  onCancelEdit: () => void
  onRequestDelete: (category: Category) => void
  onCancelDelete: () => void
  onConfirmDelete: () => Promise<void>
  onFormChange: (field: keyof CategoryForm, value: string) => void
  onSubmit: (event: FormEvent) => Promise<void>
  onEditCategory: (category: Category) => void
}

export function CategoriesSection({
  categories,
  categoryError,
  formError,
  isSavingCategory,
  isCreatingCategory,
  editingCategory,
  categoryToDelete,
  isDeletingCategory,
  categoryForm,
  onStartCreate,
  onCancelEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onFormChange,
  onSubmit,
  onEditCategory,
}: Props) {
  const [search, setSearch] = useState('')
  const filteredCategories = useMemo(
    () => filterCategoriesBySearch(categories, search),
    [categories, search],
  )

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Рубрики</h2>
          <p className="text-xs text-slate-500">
            Управление рубриками/категориями контента
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ID, названию, URL иконки…"
            autoComplete="off"
            className="h-8 min-w-[200px] max-w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          {categoryError && (
            <span className="text-[11px] text-rose-500">Ошибка: {categoryError}</span>
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
      {(isCreatingCategory || editingCategory) && (
        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {isCreatingCategory ? 'Создание рубрики' : 'Редактирование рубрики'}
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
              Название *
              <input
                type="text"
                value={categoryForm.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-slate-600">
              URL иконки
              <input
                type="text"
                value={categoryForm.icon_url}
                onChange={(e) => onFormChange('icon_url', e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={isSavingCategory}
                className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingCategory
                  ? 'Сохранение...'
                  : isCreatingCategory
                    ? 'Создать рубрику'
                    : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      )}
      {categoryToDelete && (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-[11px] text-rose-800">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold">
                Удалить рубрику #{categoryToDelete.id} ({categoryToDelete.title})?
              </p>
              <p className="text-[11px] text-rose-700">
                Действие необратимо. Рубрика исчезнет из списка.
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
              disabled={isDeletingCategory}
              className="inline-flex h-7 items-center justify-center rounded-md bg-rose-600 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingCategory ? 'Удаление...' : 'Да, удалить'}
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
      <div className="overflow-hidden rounded-xl border border-slate-100">
        <div className="max-h-[360px] overflow-auto">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Название</th>
                <th className="px-3 py-2 font-medium">Иконка</th>
                <th className="px-3 py-2 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2">{category.id}</td>
                  <td className="px-3 py-2">{category.title}</td>
                  <td className="px-3 py-2 text-slate-500">
                    {category.icon_url ? (
                      <span className="truncate text-[11px]">
                        {category.icon_url}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEditCategory(category)}
                        className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestDelete(category)}
                        className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-xs text-slate-400"
                  >
                    Рубрики не найдены
                  </td>
                </tr>
              )}
              {categories.length > 0 && filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-xs text-slate-400"
                  >
                    Ничего не найдено по запросу
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          <span>
            {search.trim()
              ? `Показано: ${filteredCategories.length} из ${categories.length}`
              : `Всего: ${categories.length}`}
          </span>
        </div>
      </div>
    </section>
  )
}

