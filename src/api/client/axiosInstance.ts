import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import { normalizeApiError } from './apiError'

// Import lazily via getState() to avoid circular dependency:
// axiosInstance → authStore → (never imports axiosInstance)
import { useAuthStore } from '@/store/authStore'
import { notificationsSocket } from '@/lib/notificationsSocket'

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach access token ─────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: silent token refresh on 401 ────────────────────────
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function drainQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else if (token) resolve(token)
  })
  pendingQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(normalizeApiError(error))
    }

    if (isRefreshing) {
      // Queue requests while a refresh is already in flight
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const { refreshToken, setAuth, clearAuth, user, authorProfile } =
      useAuthStore.getState()

    if (!refreshToken) {
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(normalizeApiError(error))
    }

    try {
      // Use a plain axios call to avoid triggering this interceptor again
      const { data } = await axios.post(
        `${env.VITE_API_BASE_URL}/auth/refresh`,
        { refreshToken },
      )
      const { accessToken: newAccess, refreshToken: newRefresh } = data.data

      setAuth(newAccess, newRefresh, user!, authorProfile ?? null)
      notificationsSocket.reconnect(newAccess)
      drainQueue(null, newAccess)

      original.headers.Authorization = `Bearer ${newAccess}`
      return apiClient(original)
    } catch (refreshErr) {
      drainQueue(refreshErr)
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(normalizeApiError(error))
    } finally {
      isRefreshing = false
    }
  },
)
