import { create } from 'zustand'
import axios from 'axios'
import { env } from '@/config/env'
import type { User, AuthorProfile } from '@/types/api/auth'

export const ACCESS_TOKEN_KEY = 'lorestack_access_token'
export const REFRESH_TOKEN_KEY = 'lorestack_refresh_token'

interface AuthState {
  user: User | null
  authorProfile: AuthorProfile | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: User,
    authorProfile: AuthorProfile | null,
  ) => void
  clearAuth: () => void
  setUser: (user: User) => void
  setAuthorProfile: (profile: AuthorProfile | null) => void
  setLoading: (loading: boolean) => void
  initAuth: () => Promise<void>
}

const initialState: AuthState = {
  user: null,
  authorProfile: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // true until initAuth completes on first load
}

export const useAuthStore = create<AuthState & AuthActions>((set, _get) => ({
  ...initialState,

  setAuth: (accessToken, refreshToken, user, authorProfile) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    set({ accessToken, refreshToken, user, authorProfile, isAuthenticated: true, isLoading: false })
  },

  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    set({ ...initialState, isLoading: false })
  },

  setUser: (user) => set({ user }),

  setAuthorProfile: (authorProfile) => set({ authorProfile }),

  setLoading: (loading) => set({ isLoading: loading }),

  // Called once on App mount. Uses plain axios to avoid circular dependency
  // with apiClient which imports this store.
  initAuth: async () => {
    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY)
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!storedAccess || !storedRefresh) {
      set({ isLoading: false })
      return
    }

    // Pre-populate tokens so axios interceptors in apiClient can function
    // while we do the validation call.
    set({ accessToken: storedAccess, refreshToken: storedRefresh })

    const authHeader = (token: string) => ({
      Authorization: `Bearer ${token}`,
    })

    const fetchUser = (token: string) =>
      axios.get(`${env.VITE_API_BASE_URL}/users/me`, { headers: authHeader(token) })

    const fetchProfile = (token: string) =>
      axios.get(`${env.VITE_API_BASE_URL}/author-profiles/me`, { headers: authHeader(token) })

    try {
      const userRes = await fetchUser(storedAccess)
      const user: User = userRes.data.data

      let authorProfile: AuthorProfile | null = null
      try {
        const profileRes = await fetchProfile(storedAccess)
        authorProfile = profileRes.data.data
      } catch {
        // 404 = not onboarded yet — that is a valid state, not an error
      }

      set({
        user,
        authorProfile,
        accessToken: storedAccess,
        refreshToken: storedRefresh,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (firstError) {
      // Access token likely expired — attempt a silent refresh
      try {
        const refreshRes = await axios.post(
          `${env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken: storedRefresh },
        )
        const { accessToken: newAccess, refreshToken: newRefresh } =
          refreshRes.data.data

        localStorage.setItem(ACCESS_TOKEN_KEY, newAccess)
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh)

        const userRes = await fetchUser(newAccess)
        const user: User = userRes.data.data

        let authorProfile: AuthorProfile | null = null
        try {
          const profileRes = await fetchProfile(newAccess)
          authorProfile = profileRes.data.data
        } catch {
          // Not onboarded yet
        }

        set({
          user,
          authorProfile,
          accessToken: newAccess,
          refreshToken: newRefresh,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        // Both tokens are invalid — clear session
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        set({ ...initialState, isLoading: false })
      }
    }
  },
}))
