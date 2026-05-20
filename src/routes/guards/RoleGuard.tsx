import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'
import type { User } from '@/types/api/auth'

interface RoleGuardProps {
  /**
   * Platform-level roles that are allowed access.
   * Currently only 'platform_admin' is elevated; all others are 'user'.
   * Company-level role checks (owner / author) happen inside feature components
   * using the usePermissions hook (Phase 2), not at route level.
   */
  allowedRoles: Array<User['platformRole']>
}

/**
 * Restricts a route to users with a matching platformRole.
 * On mismatch, redirects to the dashboard — never logs out.
 */
export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.platformRole)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
