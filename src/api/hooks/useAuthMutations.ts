import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/api/services/authService'
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
      // Hydrate user + profile after login
      const userRes = await authService.me().then((r) => r.data.data)
      return { tokens: tokenRes, user: userRes }
    },
    onSuccess: ({ tokens, user }) => {
      setAuth(tokens.accessToken, tokens.refreshToken, user, null)
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
