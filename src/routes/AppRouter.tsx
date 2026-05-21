import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { AuthGuard } from './guards/AuthGuard'
import { GuestGuard } from './guards/GuestGuard'
import { RoleGuard } from './guards/RoleGuard'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

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
import { TagsPage } from '@/pages/public/TagsPage'
import { CompaniesPage } from '@/pages/public/CompaniesPage'
import { BlogPage } from '@/pages/public/BlogPage'
import { TagPage } from '@/pages/public/TagPage'
import { AuthorProfilePage } from '@/pages/public/AuthorProfilePage'
import { CompanyProfilePage } from '@/pages/public/CompanyProfilePage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

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
import { CreateCompanyPage } from '@/pages/dashboard/CreateCompanyPage'

// Settings pages (all render inside DashboardLayout)
import { AccountSettingsPage } from '@/pages/dashboard/settings/AccountSettingsPage'
import { SettingsPlaceholderPage } from '@/pages/dashboard/settings/SettingsPlaceholderPage'

// Admin pages
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage'
import { AdminFeaturedPage } from '@/pages/admin/AdminFeaturedPage'
import { AdminModerationPage } from '@/pages/admin/AdminModerationPage'
import { AdminTagsPage } from '@/pages/admin/AdminTagsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminCompaniesPage } from '@/pages/admin/AdminCompaniesPage'
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage'

const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME,            element: <HomePage /> },
      { path: ROUTES.EXPLORE,         element: <ExplorePage /> },
      { path: ROUTES.TAGS,            element: <TagsPage /> },
      { path: ROUTES.COMPANIES,       element: <CompaniesPage /> },
      { path: ROUTES.BLOG,            element: <BlogPage /> },
      { path: ROUTES.TAG,             element: <TagPage /> },
      { path: ROUTES.AUTHOR_PROFILE,  element: <AuthorProfilePage /> },
      { path: ROUTES.COMPANY_PROFILE, element: <CompanyProfilePage /> },
      { path: '*',                    element: <NotFoundPage /> },
    ],
  },

  // ── Auth / guest routes ───────────────────────────────────────────────────
  {
    element: <GuestGuard />,
    children: [
      { path: ROUTES.REGISTER,         element: <RegisterPage /> },
      { path: ROUTES.LOGIN,            element: <LoginPage /> },
      { path: ROUTES.GOOGLE_CALLBACK,  element: <GoogleCallbackPage /> },
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

  // ── Onboarding ───────────────────────────────────────────────────────────
  {
    element: <AuthGuard skipOnboardingRedirect />,
    children: [
      { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
    ],
  },

  // ── Protected dashboard routes ────────────────────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Dashboard & writing
          { path: ROUTES.DASHBOARD,          element: <DashboardPage /> },
          { path: ROUTES.MY_BLOGS,           element: <MyBlogsPage /> },
          { path: ROUTES.DRAFTS,             element: <DraftsPage /> },
          { path: ROUTES.SCHEDULED,          element: <ScheduledPage /> },
          { path: ROUTES.NOTIFICATIONS,      element: <NotificationsPage /> },
          { path: ROUTES.CREATE_COMPANY,     element: <CreateCompanyPage /> },
          { path: ROUTES.COMPANY_DASHBOARD,  element: <CompanyDashboardPage /> },
          { path: ROUTES.COMPANY_SETTINGS,   element: <CompanySettingsPage /> },
          { path: ROUTES.TEAM_MANAGEMENT,    element: <TeamManagementPage /> },

          // Settings (all inside DashboardLayout sidebar)
          { path: ROUTES.PROFILE_SETTINGS,       element: <ProfileSettingsPage /> },
          { path: ROUTES.SETTINGS_ACCOUNT,       element: <AccountSettingsPage /> },
          { path: ROUTES.SETTINGS_NOTIFICATIONS, element: <SettingsPlaceholderPage title="Notifications" description="Control which notifications you receive." /> },
          { path: ROUTES.SETTINGS_SECURITY,      element: <SettingsPlaceholderPage title="Security" description="Two-factor authentication and session management." /> },
          { path: ROUTES.SETTINGS_CONNECTED,     element: <SettingsPlaceholderPage title="Connected accounts" description="Link your GitHub, Google, and Twitter accounts." /> },
          { path: ROUTES.SETTINGS_EMAIL,         element: <SettingsPlaceholderPage title="Email preferences" description="Choose which emails you receive from Lorestack." /> },
          { path: ROUTES.SETTINGS_DELETE,        element: <SettingsPlaceholderPage title="Delete account" description="Permanently delete your account and all your data." /> },
        ],
      },
      // Editor: full-screen layout, no sidebar
      { path: ROUTES.EDITOR_NEW, element: <EditorPage /> },
      { path: ROUTES.EDITOR,     element: <EditorPage /> },
    ],
  },

  // ── Admin routes (platform_admin only) ───────────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={['platform_admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: ROUTES.ADMIN_OVERVIEW,   element: <AdminOverviewPage /> },
              { path: ROUTES.ADMIN_FEATURED,   element: <AdminFeaturedPage /> },
              { path: ROUTES.ADMIN_MODERATION, element: <AdminModerationPage /> },
              { path: ROUTES.ADMIN_TAGS,       element: <AdminTagsPage /> },
              { path: ROUTES.ADMIN_USERS,      element: <AdminUsersPage /> },
              { path: ROUTES.ADMIN_COMPANIES,  element: <AdminCompaniesPage /> },
              { path: ROUTES.ADMIN_REPORTS,    element: <AdminReportsPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
