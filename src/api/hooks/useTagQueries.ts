import { useQuery } from '@tanstack/react-query'
import { tagService } from '@/api/services/tagService'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS.LIST,
    queryFn: () => tagService.list().then((r) => r.data.data),
  })
}

export function useTrendingTags() {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS.TRENDING,
    queryFn: () => tagService.trending().then((r) => r.data.data),
  })
}

export function useTagBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS.BY_SLUG(slug),
    queryFn: () => tagService.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  })
}
