import { useQuery } from '@tanstack/react-query'
import { engagementService } from '@/api/services/engagementService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useEngagement(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug),
    queryFn: () => engagementService.getCounters(slug).then((r) => r.data.data),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })
}

export function useMyEngagement(slug: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug),
    queryFn: () => engagementService.getMyEngagement(slug).then((r) => r.data.data),
    enabled: !!slug && isAuthenticated,
  })
}
