// All route path strings live here. Never hardcode paths elsewhere.
export const ROUTES = {
  // ── Public ──────────────────────────────────────────────────────────────
  HOME: '/',
  EXPLORE: '/explore',
  TAGS: '/tags',
  COMPANIES: '/companies',
  BLOG: '/blog/:slug',
  TAG: '/tag/:slug',
  AUTHOR_PROFILE: '/author/:username',
  COMPANY_PROFILE: '/company/:handle',

  // ── Auth ─────────────────────────────────────────────────────────────────
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  EMAIL_VERIFY: '/verify-email',
  GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
  ONBOARDING: '/onboarding',

  // ── Dashboard ─────────────────────────────────────────────────────────────
  DASHBOARD: '/dashboard',
  MY_BLOGS: '/me/blogs',
  DRAFTS: '/me/drafts',
  SCHEDULED: '/me/scheduled',
  EDITOR_NEW: '/write',
  EDITOR: '/write/:slug',
  PROFILE_SETTINGS: '/me/profile',
  NOTIFICATIONS: '/me/notifications',

  // ── Settings ──────────────────────────────────────────────────────────
  SETTINGS_ACCOUNT:       '/me/settings/account',
  SETTINGS_NOTIFICATIONS: '/me/settings/notifications',
  SETTINGS_SECURITY:      '/me/settings/security',
  SETTINGS_CONNECTED:     '/me/settings/connected',
  SETTINGS_EMAIL:         '/me/settings/email',
  SETTINGS_DELETE:        '/me/settings/delete',

  // ── Create company ────────────────────────────────────────────────────
  CREATE_COMPANY: '/me/create-company',

  // ── Company (owner/member) ─────────────────────────────────────────────
  COMPANY_DASHBOARD: '/me/company/:handle',
  COMPANY_SETTINGS: '/me/company/:handle/settings',
  TEAM_MANAGEMENT: '/me/company/:handle/team',
} as const

// Helpers to build concrete URLs from parameterised routes.
// Use these instead of manually interpolating strings.
export const buildRoute = {
  blog: (slug: string) => `/blog/${slug}`,
  tag: (slug: string) => `/tag/${slug}`,
  author: (username: string) => `/author/${username}`,
  company: (handle: string) => `/company/${handle}`,
  companyDashboard: (handle: string) => `/me/company/${handle}`,
  companySettings: (handle: string) => `/me/company/${handle}/settings`,
  teamManagement: (handle: string) => `/me/company/${handle}/team`,
  editor: (slug: string) => `/write/${slug}`,
  resetPassword: (token: string) => `/reset-password?token=${token}`,
  verifyEmail: (token: string) => `/verify-email?token=${token}`,
} as const
