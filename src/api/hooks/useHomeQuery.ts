import { useQuery } from '@tanstack/react-query'
import { homeService } from '@/api/services/homeService'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useHome() {
  return useQuery({
    queryKey: QUERY_KEYS.HOME,
    queryFn: () => homeService.get().then((r) => r.data.data),
    staleTime: 3 * 60 * 1000,
  })
}
