import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'
import { PageLoader } from '@/shared/components/feedback/PageLoader'

/**
 * Prevents authenticated users from accessing auth pages (login, register, etc.).
 * Redirects them to the dashboard instead.
 */
export function GuestGuard() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <PageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
