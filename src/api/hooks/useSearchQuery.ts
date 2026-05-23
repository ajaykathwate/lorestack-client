import { useQuery } from '@tanstack/react-query'
import { searchService } from '@/api/services/searchService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SearchType } from '@/types/api'

export function useSearch(q: string, type: SearchType = 'all') {
  return useQuery({
    queryKey: QUERY_KEYS.SEARCH.RESULTS(q, type),
    queryFn: () => searchService.search(q, type).then((r) => r.data.data),
    enabled: q.trim().length >= 2,
    staleTime: 30 * 1000,
  })
}
