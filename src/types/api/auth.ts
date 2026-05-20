// Types derived strictly from /docs/TESTING.md response payloads.

export interface User {
  id: string
  email: string
  provider: 'LOCAL' | 'GOOGLE'
  isEmailVerified: boolean
  isActive: boolean
  platformRole: 'user' | 'platform_admin'
  createdAt: string
}

export interface AuthorProfile {
  id: string
  userId: string
  displayName: string
  username: string
  bio: string | null
  avatarUrl: string | null
  expertiseTags: string[]
  twitterHandle?: string | null
  linkedinUrl?: string | null
  githubHandle?: string | null
  websiteUrl?: string | null
  createdAt: string
  updatedAt?: string
}

// ── Request payloads ─────────────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface VerifyEmailPayload {
  token: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface RefreshTokenPayload {
  refreshToken: string
}

export interface LogoutPayload {
  refreshToken: string
}

export interface OnboardingPayload {
  displayName: string
  avatarUrl?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

// ── Response shapes ──────────────────────────────────────────────────────────

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export interface MessageResponse {
  message: string
}

// Wrapper used by the backend for all responses
export interface ApiResponse<T> {
  data: T
}
