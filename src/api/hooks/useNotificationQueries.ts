import { useQuery } from '@tanstack/react-query'
import { notificationsService } from '@/api/services/notificationsService'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useNotifications(page = 1) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(page),
    queryFn: () =>
      notificationsService.list(page, 20).then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

export function useUnreadCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
    queryFn: () =>
      notificationsService.unreadCount().then((r) => r.data.data.count),
    enabled: isAuthenticated,
    staleTime: 60_000,
  })
}
