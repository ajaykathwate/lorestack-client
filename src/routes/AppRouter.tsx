import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { AuthGuard } from './guards/AuthGuard'
import { GuestGuard } from './guards/GuestGuard'
import { RoleGuard } from './guards/RoleGuard'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'

// Auth pages
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { EmailVerifyPage } from '@/pages/auth/EmailVerifyPage'
import { GoogleCallbackPage } from '@/pages/auth/GoogleCallbackPage'
import { OnboardingPage } from '@/pages/auth/OnboardingPage'

// Public pages
import { HomePage } from '@/pages/public/HomePage'
import { ExplorePage } from '@/pages/public/ExplorePage'
import { BlogPage } from '@/pages/public/BlogPage'
import { TagPage } from '@/pages/public/TagPage'
import { AuthorProfilePage } from '@/pages/public/AuthorProfilePage'
import { CompanyProfilePage } from '@/pages/public/CompanyProfilePage'

// Dashboard pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { MyBlogsPage } from '@/pages/dashboard/MyBlogsPage'
import { DraftsPage } from '@/pages/dashboard/DraftsPage'
import { ScheduledPage } from '@/pages/dashboard/ScheduledPage'
import { ProfileSettingsPage } from '@/pages/dashboard/ProfileSettingsPage'
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage'
import { EditorPage } from '@/pages/dashboard/EditorPage'
import { CompanyDashboardPage } from '@/pages/dashboard/CompanyDashboardPage'
import { CompanySettingsPage } from '@/pages/dashboard/CompanySettingsPage'
import { TeamManagementPage } from '@/pages/dashboard/TeamManagementPage'

const router = createBrowserRouter([
  // ── Public routes (no auth required) ────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME,            element: <HomePage /> },
      { path: ROUTES.EXPLORE,         element: <ExplorePage /> },
      { path: ROUTES.BLOG,            element: <BlogPage /> },
      { path: ROUTES.TAG,             element: <TagPage /> },
      { path: ROUTES.AUTHOR_PROFILE,  element: <AuthorProfilePage /> },
      { path: ROUTES.COMPANY_PROFILE, element: <CompanyProfilePage /> },
    ],
  },

  // ── Auth routes: Register + Login (full split-page layout, no AuthLayout card) ──
  {
    element: <GuestGuard />,
    children: [
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.LOGIN,    element: <LoginPage /> },
      { path: ROUTES.GOOGLE_CALLBACK, element: <GoogleCallbackPage /> },

      // Forgot + Reset use the centered card AuthLayout
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD,  element: <ResetPasswordPage /> },
          { path: ROUTES.EMAIL_VERIFY,    element: <EmailVerifyPage /> },
        ],
      },
    ],
  },

  // ── Onboarding (authenticated, but no authorProfile required yet) ─────────
  {
    element: <AuthGuard skipOnboardingRedirect />,
    children: [
      { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
    ],
  },

  // ── Protected dashboard routes (auth + onboarding required) ───────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD,        element: <DashboardPage /> },
          { path: ROUTES.MY_BLOGS,         element: <MyBlogsPage /> },
          { path: ROUTES.DRAFTS,           element: <DraftsPage /> },
          { path: ROUTES.SCHEDULED,        element: <ScheduledPage /> },
          { path: ROUTES.PROFILE_SETTINGS, element: <ProfileSettingsPage /> },
          { path: ROUTES.NOTIFICATIONS,    element: <NotificationsPage /> },
          { path: ROUTES.COMPANY_DASHBOARD,  element: <CompanyDashboardPage /> },
          { path: ROUTES.COMPANY_SETTINGS,   element: <CompanySettingsPage /> },
          { path: ROUTES.TEAM_MANAGEMENT,    element: <TeamManagementPage /> },
        ],
      },
      // Editor uses its own full-screen layout (no DashboardLayout chrome)
      { path: ROUTES.EDITOR_NEW, element: <EditorPage /> },
      { path: ROUTES.EDITOR,     element: <EditorPage /> },
    ],
  },

  // ── Admin routes ─────────────────────────────────────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={['platform_admin']} />,
        children: [
          // Admin pages: Phase 3+ scope
        ],
      },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-bg font-sans">
        <div className="text-center">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest mb-2">404</p>
          <h1 className="font-serif text-3xl text-ink mb-4">Page not found</h1>
          <a href="/" className="text-sm text-ls-accent underline underline-offset-2">
            Back to homepage
          </a>
        </div>
      </div>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
