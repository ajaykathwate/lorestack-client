import { useMutation, useQueryClient } from '@tanstack/react-query'
import { engagementService } from '@/api/services/engagementService'
import { QUERY_KEYS } from '@/constants/queryKeys'

function invalidateEngagement(qc: ReturnType<typeof useQueryClient>, slug: string) {
  qc.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug) })
  qc.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug) })
}

export function useLikeBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.like(slug),
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useUnlikeBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.unlike(slug),
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useSaveBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.save(slug),
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useUnsaveBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.unsave(slug),
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useShareBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (channel?: string) => engagementService.share(slug, channel),
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug) }),
  })
}

export function useRecordView(slug: string) {
  return useMutation({
    mutationFn: (payload?: { source?: 'explore' | 'search' | 'direct' | 'tag' | 'profile' }) =>
      engagementService.recordView(slug, payload),
  })
}
