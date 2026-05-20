import { apiClient } from '@/api/client/axiosInstance'
import type {
  RegisterPayload,
  LoginPayload,
  VerifyEmailPayload,
  ResendVerificationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RefreshTokenPayload,
  LogoutPayload,
  OnboardingPayload,
  ChangePasswordPayload,
  TokenResponse,
  MessageResponse,
  ApiResponse,
  User,
  AuthorProfile,
} from '@/types/api'

export const authService = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/register', payload),

  verifyEmail: (payload: VerifyEmailPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/verify-email', payload),

  resendVerification: (payload: ResendVerificationPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/resend-verification', payload),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<TokenResponse>>('/auth/login', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/forgot-password', payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/reset-password', payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    apiClient.post<ApiResponse<TokenResponse>>('/auth/refresh', payload),

  logout: (payload: LogoutPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/logout', payload),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.post<ApiResponse<MessageResponse>>('/auth/change-password', payload),

  onboarding: (payload: OnboardingPayload) =>
    apiClient.post<ApiResponse<AuthorProfile>>('/auth/onboarding', payload),

  me: () =>
    apiClient.get<ApiResponse<User>>('/users/me'),
}
