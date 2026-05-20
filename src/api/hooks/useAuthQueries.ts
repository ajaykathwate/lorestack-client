import { useQuery } from '@tanstack/react-query'
import { authService } from '@/api/services/authService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: () => authService.me().then((r) => r.data.data),
    enabled: isAuthenticated,
  })
}
