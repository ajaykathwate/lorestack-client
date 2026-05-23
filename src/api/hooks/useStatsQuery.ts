import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/api/services/statsService'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: () => statsService.get().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
