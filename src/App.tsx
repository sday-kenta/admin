import { useCallback, useEffect, useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { apiFetch } from './api/client'
import { useAuth } from './auth/AuthContext'
import { UsersSection } from './components/UsersSection'
import { CategoriesSection } from './components/CategoriesSection'
import { IncidentsSection } from './components/IncidentsSection'
import { LoginPage } from './components/LoginPage'

export type User = {
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
  role: string
  created_at: string
  updated_at: string
}

export type UserForm = {
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
  role: string
}

export type Category = {
  id: number
  title: string
  icon_url?: string
}

export type CategoryForm = {
  title: string
}

export type IncidentPhoto = {
  id: number
  file_url: string
  content_type?: string
  size_bytes: number
  sort_order: number
  created_at: string
}

export type Incident = {
  id: number
  user_id: number
  category_id: number
  category_title: string
  title: string
  description: string
  status: string
  department_name?: string
  city?: string
  street?: string
  house?: string
  address_text: string
  latitude: number
  longitude: number
  photos?: IncidentPhoto[]
  published_at?: string
  created_at: string
  updated_at: string
}

type View = 'users' | 'categories' | 'incidents'

export type IncidentStatusFilter = 'all' | 'draft' | 'review' | 'published'

export type IncidentCreateForm = {
  category_id: string
  title: string
  description: string
  status: 'draft' | 'review' | 'published'
  department_name: string
  city: string
  street: string
  house: string
  address_text: string
  latitude: string
  longitude: string
}

function AdminPanel() {
  const { session, logout } = useAuth()

  const [view, setView] = useState<View>('users')
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingCategory, setIsSavingCategory] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    title: '',
  })
  const [categoryIconFile, setCategoryIconFile] = useState<File | null>(null)
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
    role: 'user',
  })

  const [incidents, setIncidents] = useState<Incident[]>([])
  const [incidentsLoading, setIncidentsLoading] = useState(false)
  const [incidentsError, setIncidentsError] = useState<string | null>(null)
  const [incidentStatusFilter, setIncidentStatusFilter] =
    useState<IncidentStatusFilter>('all')
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(null)
  const [isDeletingIncident, setIsDeletingIncident] = useState(false)
  const [incidentForPhotos, setIncidentForPhotos] = useState<Incident | null>(null)
  const [incidentPhotoFiles, setIncidentPhotoFiles] = useState<File[]>([])
  const [incidentPhotosError, setIncidentPhotosError] = useState<string | null>(null)
  const [isLoadingIncidentPhotos, setIsLoadingIncidentPhotos] = useState(false)
  const [isUploadingIncidentPhotos, setIsUploadingIncidentPhotos] = useState(false)
  const [publishingIncidentID, setPublishingIncidentID] = useState<number | null>(
    null,
  )
  const [deletingIncidentPhotoID, setDeletingIncidentPhotoID] = useState<number | null>(
    null,
  )
  const [isCreatingIncident, setIsCreatingIncident] = useState(false)
  const [isSavingIncident, setIsSavingIncident] = useState(false)
  const [incidentFormError, setIncidentFormError] = useState<string | null>(null)
  const [incidentForm, setIncidentForm] = useState<IncidentCreateForm>({
    category_id: '',
    title: '',
    description: '',
    status: 'review',
    department_name: '',
    city: '',
    street: '',
    house: '',
    address_text: '',
    latitude: '',
    longitude: '',
  })

  const fetchIncidents = useCallback(async () => {
    try {
      setIncidentsLoading(true)
      setIncidentsError(null)
      const params = new URLSearchParams()
      if (incidentStatusFilter !== 'all') {
        params.set('status', incidentStatusFilter)
      }
      const qs = params.toString()
      const path = `/v1/incidents${qs ? `?${qs}` : ''}`
      const res = await apiFetch(path)
      if (!res.ok) {
        throw new Error(`Ошибка загрузки инцидентов: ${res.status}`)
      }
      const data = (await res.json()) as Incident[]
      setIncidents(data)
    } catch (err) {
      setIncidentsError(
        err instanceof Error ? err.message : 'Не удалось загрузить инциденты',
      )
    } finally {
      setIncidentsLoading(false)
    }
  }, [incidentStatusFilter])

  useEffect(() => {
    if (view !== 'incidents') return
    void fetchIncidents()
  }, [view, fetchIncidents])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await apiFetch('/v1/users')
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

    const fetchCategories = async () => {
      try {
        setCategoryError(null)
        const res = await apiFetch('/v1/categories')
        if (!res.ok) {
          throw new Error(`Ошибка загрузки рубрик: ${res.status}`)
        }
        const raw = (await res.json()) as Category[] | { data?: Category[] }
        const list = Array.isArray(raw) ? raw : raw.data || []
        setCategories(list)
      } catch (err) {
        setCategoryError(
          err instanceof Error ? err.message : 'Не удалось загрузить рубрики',
        )
      }
    }

    fetchUsers()
    fetchCategories()
  }, [])

  const requestDeleteUser = (user: User) => {
    setUserToDelete(user)
  }

  const cancelDeleteUser = () => {
    setUserToDelete(null)
    setIsDeleting(false)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setIsDeleting(true)
      const res = await apiFetch(`/v1/users/${userToDelete.id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('Не удалось удалить пользователя')
      }
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
      setUserToDelete(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления')
    } finally {
      setIsDeleting(false)
    }
  }

  const requestDeleteCategory = (category: Category) => {
    setCategoryToDelete(category)
  }

  const cancelDeleteCategory = () => {
    setCategoryToDelete(null)
    setIsDeletingCategory(false)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      setIsDeletingCategory(true)
      const res = await apiFetch(`/v1/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Не удалось удалить рубрику')
      }
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
      setCategoryToDelete(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления рубрики')
    } finally {
      setIsDeletingCategory(false)
    }
  }

  const requestDeleteIncident = (incident: Incident) => {
    setIncidentToDelete(incident)
  }

  const cancelDeleteIncident = () => {
    setIncidentToDelete(null)
    setIsDeletingIncident(false)
  }

  const confirmDeleteIncident = async () => {
    if (!incidentToDelete) return

    try {
      setIsDeletingIncident(true)
      const res = await apiFetch(`/v1/incidents/${incidentToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Не удалось удалить инцидент')
      }
      setIncidents((prev) => prev.filter((i) => i.id !== incidentToDelete.id))
      setIncidentToDelete(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления')
    } finally {
      setIsDeletingIncident(false)
    }
  }

  const fetchIncidentByID = async (id: number): Promise<Incident> => {
    const res = await apiFetch(`/v1/incidents/${id}`)
    if (!res.ok) {
      throw new Error('Не удалось получить данные инцидента')
    }
    return (await res.json()) as Incident
  }

  const updateIncidentInList = (updated: Incident) => {
    setIncidents((prev) => {
      if (incidentStatusFilter !== 'all' && updated.status !== incidentStatusFilter) {
        return prev.filter((item) => item.id !== updated.id)
      }
      return prev.map((item) => (item.id === updated.id ? updated : item))
    })
    setIncidentForPhotos((prev) => (prev?.id === updated.id ? updated : prev))
  }

  const openIncidentPhotos = async (incident: Incident) => {
    try {
      setIsLoadingIncidentPhotos(true)
      setIncidentPhotosError(null)
      const detailed = await fetchIncidentByID(incident.id)
      setIncidentForPhotos(detailed)
      updateIncidentInList(detailed)
    } catch (err) {
      setIncidentPhotosError(
        err instanceof Error ? err.message : 'Не удалось загрузить фото инцидента',
      )
    } finally {
      setIsLoadingIncidentPhotos(false)
    }
  }

  const closeIncidentPhotos = () => {
    setIncidentForPhotos(null)
    setIncidentPhotoFiles([])
    setIncidentPhotosError(null)
    setIsLoadingIncidentPhotos(false)
    setIsUploadingIncidentPhotos(false)
    setDeletingIncidentPhotoID(null)
  }

  const handleIncidentPhotoFilesChange = (files: FileList | null) => {
    setIncidentPhotoFiles(files ? Array.from(files) : [])
  }

  const uploadIncidentPhotos = async () => {
    if (!incidentForPhotos) return
    if (incidentPhotoFiles.length === 0) {
      setIncidentPhotosError('Выберите хотя бы один файл')
      return
    }
    try {
      setIsUploadingIncidentPhotos(true)
      setIncidentPhotosError(null)
      const formData = new FormData()
      for (const file of incidentPhotoFiles) {
        formData.append('photos', file)
      }
      const res = await apiFetch(`/v1/incidents/${incidentForPhotos.id}/photos`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        throw new Error('Не удалось загрузить фото')
      }
      const refreshed = await fetchIncidentByID(incidentForPhotos.id)
      setIncidentForPhotos(refreshed)
      updateIncidentInList(refreshed)
      setIncidentPhotoFiles([])
    } catch (err) {
      setIncidentPhotosError(
        err instanceof Error ? err.message : 'Ошибка загрузки фотографий',
      )
    } finally {
      setIsUploadingIncidentPhotos(false)
    }
  }

  const deleteIncidentPhoto = async (photoID: number) => {
    if (!incidentForPhotos) return
    try {
      setDeletingIncidentPhotoID(photoID)
      setIncidentPhotosError(null)
      const res = await apiFetch(
        `/v1/incidents/${incidentForPhotos.id}/photos/${photoID}`,
        { method: 'DELETE' },
      )
      if (!res.ok) {
        throw new Error('Не удалось удалить фото')
      }
      const refreshed = await fetchIncidentByID(incidentForPhotos.id)
      setIncidentForPhotos(refreshed)
      updateIncidentInList(refreshed)
    } catch (err) {
      setIncidentPhotosError(
        err instanceof Error ? err.message : 'Ошибка удаления фотографии',
      )
    } finally {
      setDeletingIncidentPhotoID(null)
    }
  }

  const publishIncident = async (incident: Incident) => {
    try {
      setPublishingIncidentID(incident.id)
      const res = await apiFetch(`/v1/incidents/${incident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      if (!res.ok) {
        let message = 'Не удалось опубликовать инцидент'
        try {
          const data = (await res.json()) as { message?: string }
          if (data.message) {
            message = data.message
          }
        } catch {
          // Ignore response parsing errors and show fallback text.
        }
        throw new Error(message)
      }
      const updated = (await res.json()) as Incident
      updateIncidentInList(updated)
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Ошибка публикации инцидента',
      )
    } finally {
      setPublishingIncidentID(null)
    }
  }

  const startCreateIncident = () => {
    setIsCreatingIncident((prev) => !prev)
    setIncidentFormError(null)
    if (isCreatingIncident) return
    setIncidentForm({
      category_id: '',
      title: '',
      description: '',
      status: 'review',
      department_name: '',
      city: '',
      street: '',
      house: '',
      address_text: '',
      latitude: '',
      longitude: '',
    })
  }

  const handleIncidentFormChange = (
    field: keyof IncidentCreateForm,
    value: string,
  ) => {
    setIncidentForm((prev) => ({ ...prev, [field]: value }))
  }

  const submitIncidentCreate = async (event: FormEvent) => {
    event.preventDefault()
    setIncidentFormError(null)

    if (
      !incidentForm.category_id.trim() ||
      !incidentForm.title.trim() ||
      !incidentForm.description.trim() ||
      !incidentForm.address_text.trim()
    ) {
      setIncidentFormError('Заполните категорию, заголовок, описание и адрес')
      return
    }

    const parsedCategoryID = Number(incidentForm.category_id)
    if (!Number.isInteger(parsedCategoryID) || parsedCategoryID <= 0) {
      setIncidentFormError('Выберите корректную рубрику')
      return
    }

    const payload: Record<string, unknown> = {
      category_id: parsedCategoryID,
      title: incidentForm.title.trim(),
      description: incidentForm.description.trim(),
      status: incidentForm.status,
      department_name: incidentForm.department_name.trim() || undefined,
      city: incidentForm.city.trim() || undefined,
      street: incidentForm.street.trim() || undefined,
      house: incidentForm.house.trim() || undefined,
      address_text: incidentForm.address_text.trim(),
    }

    if (incidentForm.latitude.trim() || incidentForm.longitude.trim()) {
      const lat = Number(incidentForm.latitude)
      const lng = Number(incidentForm.longitude)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        setIncidentFormError('Координаты должны быть числами')
        return
      }
      payload.latitude = lat
      payload.longitude = lng
    }

    try {
      setIsSavingIncident(true)
      const res = await apiFetch('/v1/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error('Не удалось создать инцидент')
      }
      const created = (await res.json()) as Incident
      setIncidents((prev) => [created, ...prev])
      setIsCreatingIncident(false)
      setIncidentForm({
        category_id: '',
        title: '',
        description: '',
        status: 'review',
        department_name: '',
        city: '',
        street: '',
        house: '',
        address_text: '',
        latitude: '',
        longitude: '',
      })
    } catch (err) {
      setIncidentFormError(
        err instanceof Error ? err.message : 'Ошибка создания инцидента',
      )
    } finally {
      setIsSavingIncident(false)
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
      role: 'user',
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
      role: user.role,
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

  // ----- Рубрики -----

  const startCreateCategory = () => {
    if (isCreatingCategory) {
      cancelEditCategory()
      return
    }

    setEditingCategory(null)
    setIsCreatingCategory(true)
    setFormError(null)
    setCategoryForm({
      title: '',
    })
    setCategoryIconFile(null)
  }

  const startEditCategory = (category: Category) => {
    setIsCreatingCategory(false)
    setEditingCategory(category)
    setFormError(null)
    setCategoryForm({
      title: category.title,
    })
    setCategoryIconFile(null)
  }

  const cancelEditCategory = () => {
    setEditingCategory(null)
    setIsCreatingCategory(false)
    setFormError(null)
    setIsSavingCategory(false)
    setCategoryIconFile(null)
  }

  const handleCategoryFormChange = (field: keyof CategoryForm, value: string) => {
    setCategoryForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryIconFileChange = (file: File | null) => {
    setCategoryIconFile(file)
  }

  const uploadCategoryIcon = async (
    categoryID: number,
    file: File,
  ): Promise<Category> => {
    const formData = new FormData()
    formData.append('icon', file)
    const res = await apiFetch(`/v1/categories/${categoryID}/icon`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      throw new Error('Не удалось загрузить иконку рубрики')
    }
    const raw = (await res.json()) as Category | { data?: Category }
    return 'data' in raw && raw.data ? raw.data : (raw as Category)
  }

  const deleteCategoryIcon = async (categoryID: number): Promise<Category> => {
    const delRes = await apiFetch(`/v1/categories/${categoryID}/icon`, {
      method: 'DELETE',
    })
    if (!delRes.ok) {
      throw new Error('Не удалось удалить иконку рубрики')
    }
    const getRes = await apiFetch(`/v1/categories/${categoryID}`)
    if (!getRes.ok) {
      throw new Error('Не удалось обновить рубрику после удаления иконки')
    }
    const raw = (await getRes.json()) as Category | { data?: Category }
    return 'data' in raw && raw.data ? raw.data : (raw as Category)
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
        const res = await apiFetch('/v1/users', {
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
            role: userForm.role,
          }),
        })

        if (!res.ok) {
          // Пытаемся вытащить текст ошибки из ответа бэкенда
          try {
            const data = (await res.json()) as { message?: string }
            throw new Error(data.message || 'Не удалось создать пользователя')
          } catch {
            throw new Error('Не удалось создать пользователя')
          }
        }

        const created = (await res.json()) as User
        setUsers((prev) => [...prev, created])
        cancelEdit()
      } else if (editingUser) {
        const res = await apiFetch(`/v1/users/${editingUser.id}`, {
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
            role: userForm.role,
          }),
        })

        if (!res.ok) {
          try {
            const data = (await res.json()) as { message?: string }
            throw new Error(data.message || 'Не удалось обновить пользователя')
          } catch {
            throw new Error('Не удалось обновить пользователя')
          }
        }

        const updated = (await res.json()) as User
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
        cancelEdit()
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Ошибка сохранения пользователя',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitCategory = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!categoryForm.title.trim()) {
      setFormError('Нужно указать название рубрики')
      return
    }

    try {
      setIsSavingCategory(true)

      if (isCreatingCategory) {
        const res = await apiFetch('/v1/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: categoryForm.title.trim(),
          }),
        })

        if (!res.ok) {
          throw new Error('Не удалось создать рубрику')
        }

        const raw = (await res.json()) as Category | { data?: Category }
        const created = 'data' in raw && raw.data ? raw.data : (raw as Category)
        const createdWithIcon = categoryIconFile
          ? await uploadCategoryIcon(created.id, categoryIconFile)
          : created
        setCategories((prev) => [...prev, createdWithIcon])
        cancelEditCategory()
      } else if (editingCategory) {
        const res = await apiFetch(`/v1/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: categoryForm.title.trim(),
          }),
        })

        if (!res.ok) {
          throw new Error('Не удалось обновить рубрику')
        }

        const raw = (await res.json()) as Category | { data?: Category }
        const updated = 'data' in raw && raw.data ? raw.data : (raw as Category)
        const updatedWithIcon = categoryIconFile
          ? await uploadCategoryIcon(updated.id, categoryIconFile)
          : updated
        setCategories((prev) =>
          prev.map((c) => (c.id === updatedWithIcon.id ? updatedWithIcon : c)),
        )
        cancelEditCategory()
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения рубрики')
    } finally {
      setIsSavingCategory(false)
    }
  }

  const handleDeleteCategoryIcon = async () => {
    if (!editingCategory) return
    setFormError(null)
    try {
      setIsSavingCategory(true)
      const updated = await deleteCategoryIcon(editingCategory.id)
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setEditingCategory(updated)
      setCategoryIconFile(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка удаления иконки')
    } finally {
      setIsSavingCategory(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Admin Panel
            </h1>
            <p className="text-sm text-slate-500">
              Пользователи, рубрики и инциденты
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="hidden sm:inline">
              {session?.login}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <Sidebar
          view={view}
          setView={setView}
          users={users}
          categories={categories}
          incidentsCount={incidents.length}
        />

        <section className="flex-1">
          {view === 'users' && (
            <UsersSection
              users={users}
              isLoading={isLoading}
              error={error}
              formError={formError}
              isSaving={isSaving}
              isCreating={isCreating}
              editingUser={editingUser}
              userToDelete={userToDelete}
              isDeleting={isDeleting}
              userForm={userForm}
              onStartCreate={startCreateUser}
              onCancelEdit={cancelEdit}
              onEditUser={handleEditUser}
              onRequestDelete={requestDeleteUser}
              onCancelDelete={cancelDeleteUser}
              onConfirmDelete={confirmDeleteUser}
              onFormChange={handleFormChange}
              onSubmit={handleSubmitUser}
            />
          )}
          {view === 'categories' && (
            <CategoriesSection
              categories={categories}
              categoryError={categoryError}
              formError={formError}
              isSavingCategory={isSavingCategory}
              isCreatingCategory={isCreatingCategory}
              editingCategory={editingCategory}
              categoryToDelete={categoryToDelete}
              isDeletingCategory={isDeletingCategory}
              categoryForm={categoryForm}
              categoryIconFile={categoryIconFile}
              onStartCreate={startCreateCategory}
              onCancelEdit={cancelEditCategory}
              onRequestDelete={requestDeleteCategory}
              onCancelDelete={cancelDeleteCategory}
              onConfirmDelete={confirmDeleteCategory}
              onFormChange={handleCategoryFormChange}
              onIconFileChange={handleCategoryIconFileChange}
              onDeleteIcon={handleDeleteCategoryIcon}
              onSubmit={handleSubmitCategory}
              onEditCategory={startEditCategory}
            />
          )}
          {view === 'incidents' && (
            <IncidentsSection
              incidents={incidents}
              categories={categories}
              isLoading={incidentsLoading}
              error={incidentsError}
              formError={incidentFormError}
              isCreating={isCreatingIncident}
              isSaving={isSavingIncident}
              incidentForm={incidentForm}
              statusFilter={incidentStatusFilter}
              onStatusFilterChange={setIncidentStatusFilter}
              onStartCreate={startCreateIncident}
              onFormChange={handleIncidentFormChange}
              onSubmitCreate={submitIncidentCreate}
              incidentToDelete={incidentToDelete}
              isDeleting={isDeletingIncident}
              incidentForPhotos={incidentForPhotos}
              incidentPhotosError={incidentPhotosError}
              incidentPhotoFiles={incidentPhotoFiles}
              isLoadingIncidentPhotos={isLoadingIncidentPhotos}
              isUploadingIncidentPhotos={isUploadingIncidentPhotos}
              publishingIncidentID={publishingIncidentID}
              deletingIncidentPhotoID={deletingIncidentPhotoID}
              onRequestDelete={requestDeleteIncident}
              onCancelDelete={cancelDeleteIncident}
              onConfirmDelete={confirmDeleteIncident}
              onPublishIncident={publishIncident}
              onOpenPhotos={openIncidentPhotos}
              onClosePhotos={closeIncidentPhotos}
              onPhotoFilesChange={handleIncidentPhotoFilesChange}
              onUploadPhotos={uploadIncidentPhotos}
              onDeletePhoto={deleteIncidentPhoto}
              onRefresh={fetchIncidents}
            />
          )}
        </section>
      </main>
    </div>
  )
}

function App() {
  const { session, loading, login } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Загрузка...
      </div>
    )
  }

  if (!session) {
    return <LoginPage onLogin={login} />
  }

  return <AdminPanel />
}

type SidebarProps = {
  view: View
  setView: Dispatch<SetStateAction<View>>
  users: User[]
  categories: Category[]
  incidentsCount: number
}

function Sidebar({
  view,
  setView,
  users,
  categories,
  incidentsCount,
}: SidebarProps) {
  return (
    <aside className="w-56 shrink-0">
      <nav className="space-y-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <button
          type="button"
          onClick={() => setView('users')}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
            view === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Пользователи</span>
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setView('categories')}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
            view === 'categories'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Рубрики</span>
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
            {categories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setView('incidents')}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
            view === 'incidents'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Инциденты</span>
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
            {incidentsCount}
          </span>
        </button>
      </nav>
    </aside>
  )
}

export default App
