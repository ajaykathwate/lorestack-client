import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/api/services/authService'
import { apiClient } from '@/api/client/axiosInstance'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import type {
  RegisterPayload,
  LoginPayload,
  VerifyEmailPayload,
  ResendVerificationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  OnboardingPayload,
  ChangePasswordPayload,
  ApiResponse,
  User,
} from '@/types/api'

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      authService.register(payload).then((r) => r.data.data),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload).then((r) => r.data.data),
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      authService.resendVerification(payload).then((r) => r.data.data),
  })
}

export function useLogin() {
  const { setAuth } = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const tokenRes = await authService.login(payload).then((r) => r.data.data)
      const authHeader = { Authorization: `Bearer ${tokenRes.accessToken}` }

      // Fetch user and profile atomically with the token, before updating the
      // store, so there is no window where isAuthenticated=true but authorProfile=null.
      const userRes = await apiClient
        .get<ApiResponse<User>>('/users/me', { headers: authHeader })
        .then((r) => r.data.data)

      let authorProfile = null
      try {
        const profileRes = await apiClient.get('/author-profiles/me', { headers: authHeader })
        authorProfile = profileRes.data.data
      } catch {
        // 404 = not yet onboarded — valid state
      }

      return { tokens: tokenRes, user: userRes, authorProfile }
    },
    onSuccess: ({ tokens, user, authorProfile }) => {
      setAuth(tokens.accessToken, tokens.refreshToken, user, authorProfile)
      qc.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME })
    },
  })
}

export function useLogout() {
  const { clearAuth, refreshToken } = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () =>
      authService.logout({ refreshToken: refreshToken ?? '' }).then((r) => r.data.data),
    onSettled: () => {
      clearAuth()
      qc.clear()
      window.location.href = ROUTES.LOGIN
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload).then((r) => r.data.data),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload).then((r) => r.data.data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload).then((r) => r.data.data),
  })
}

export function useOnboarding() {
  const { setAuthorProfile } = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: OnboardingPayload) =>
      authService.onboarding(payload).then((r) => r.data.data),
    onSuccess: (profile) => {
      setAuthorProfile(profile)
      qc.invalidateQueries({ queryKey: QUERY_KEYS.AUTHOR_PROFILES.ME })
    },
  })
}
