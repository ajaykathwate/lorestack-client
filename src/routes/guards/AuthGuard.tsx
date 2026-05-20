import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'
import { PageLoader } from '@/shared/components/feedback/PageLoader'

/**
 * Protects routes that require authentication.
 * - Shows PageLoader while auth state is being initialised (Phase 2 adds initAuth).
 * - Redirects to /login if not authenticated, preserving the intended destination.
 * - Redirects to /onboarding if authenticated but onboarding is not yet complete.
 */
interface AuthGuardProps {
  skipOnboardingRedirect?: boolean
}

export function AuthGuard({ skipOnboardingRedirect = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading, authorProfile } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    )
  }

  // Redirect to onboarding if profile not yet created, unless this guard is
  // wrapping the onboarding route itself (skipOnboardingRedirect = true).
  if (!skipOnboardingRedirect && authorProfile === null) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return <Outlet />
}
