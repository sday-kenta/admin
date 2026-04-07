import { useMemo, useState } from 'react'
import type { Incident } from '../App'

type StatusFilter = 'all' | 'draft' | 'published'

type Props = {
  incidents: Incident[]
  isLoading: boolean
  error: string | null
  statusFilter: StatusFilter
  onStatusFilterChange: (v: StatusFilter) => void
  incidentToDelete: Incident | null
  isDeleting: boolean
  onRequestDelete: (incident: Incident) => void
  onCancelDelete: () => void
  onConfirmDelete: () => Promise<void>
  onRefresh: () => void
}

function filterIncidentsBySearch(incidents: Incident[], query: string): Incident[] {
  const q = query.trim().toLowerCase()
  if (!q) return incidents
  return incidents.filter((inc) => {
    const blob = [
      String(inc.id),
      String(inc.user_id),
      String(inc.category_id),
      inc.category_title,
      inc.title,
      inc.description,
      inc.status,
      inc.department_name ?? '',
      inc.city ?? '',
      inc.street ?? '',
      inc.house ?? '',
      inc.address_text,
    ]
      .join(' ')
      .toLowerCase()
    return blob.includes(q)
  })
}

function statusLabel(status: string): string {
  switch (status) {
    case 'draft':
      return 'Черновик'
    case 'published':
      return 'Опубликован'
    default:
      return status
  }
}

export function IncidentsSection({
  incidents,
  isLoading,
  error,
  statusFilter,
  onStatusFilterChange,
  incidentToDelete,
  isDeleting,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () => filterIncidentsBySearch(incidents, search),
    [incidents, search],
  )

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Инциденты</h2>
          <p className="text-xs text-slate-500">
            Обращения пользователей (все статусы при запросе от админа)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-[11px] text-slate-600">
            Статус
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">Все</option>
              <option value="draft">Черновики</option>
              <option value="published">Опубликованные</option>
            </select>
          </label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ID, автору, рубрике, тексту…"
            autoComplete="off"
            className="h-8 min-w-[200px] max-w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Обновить
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="mb-4 text-[11px] text-slate-400">Загрузка...</p>
      )}
      {error && (
        <p className="mb-4 text-[11px] text-rose-500">Ошибка: {error}</p>
      )}

      {incidentToDelete && (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-[11px] text-rose-800">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold">
                Удалить инцидент #{incidentToDelete.id} ({incidentToDelete.title})?
              </p>
              <p className="text-[11px] text-rose-700">Действие необратимо.</p>
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

      <div className="overflow-hidden rounded-xl border border-slate-100">
        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Автор</th>
                <th className="px-3 py-2 font-medium">Рубрика</th>
                <th className="px-3 py-2 font-medium">Заголовок</th>
                <th className="px-3 py-2 font-medium">Статус</th>
                <th className="px-3 py-2 font-medium">Адрес</th>
                <th className="px-3 py-2 font-medium">Создан</th>
                <th className="px-3 py-2 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {filtered.map((inc) => (
                <tr key={inc.id} className="align-top hover:bg-slate-50/70">
                  <td className="px-3 py-2 whitespace-nowrap">{inc.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{inc.user_id}</td>
                  <td className="px-3 py-2 max-w-[140px]">
                    <span className="line-clamp-2" title={inc.category_title}>
                      {inc.category_title || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2 max-w-[220px]">
                    <span className="line-clamp-2" title={inc.title}>
                      {inc.title}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={
                        'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                        (inc.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
                          : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200')
                      }
                    >
                      {statusLabel(inc.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 max-w-[180px] text-slate-600">
                    <span className="line-clamp-2 text-[11px]" title={inc.address_text}>
                      {inc.address_text || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-[11px] text-slate-500">
                    {formatDate(inc.created_at)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRequestDelete(inc)}
                      className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && incidents.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-4 text-center text-xs text-slate-400"
                  >
                    Инцидентов нет
                  </td>
                </tr>
              )}
              {!isLoading &&
                incidents.length > 0 &&
                filtered.length === 0 &&
                !error && (
                  <tr>
                    <td
                      colSpan={8}
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
              ? `Показано: ${filtered.length} из ${incidents.length}`
              : `Всего: ${incidents.length}`}
          </span>
        </div>
      </div>
    </section>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
