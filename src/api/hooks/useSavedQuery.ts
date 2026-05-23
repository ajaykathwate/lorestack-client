import { useQuery } from '@tanstack/react-query'
import { savedService } from '@/api/services/savedService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useSavedArticles(page = 1) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.SAVED.LIST(page),
    queryFn: () => savedService.getSaved({ page, limit: 20 }).then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })
}
