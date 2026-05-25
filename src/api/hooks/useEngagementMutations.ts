import { useMutation, useQueryClient } from '@tanstack/react-query'
import { engagementService } from '@/api/services/engagementService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { BlogEngagement, MyEngagement } from '@/types/api'

function invalidateEngagement(qc: ReturnType<typeof useQueryClient>, slug: string) {
  qc.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug) })
  qc.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug) })
}

function patchCounters(
  qc: ReturnType<typeof useQueryClient>,
  slug: string,
  updater: (data: BlogEngagement) => BlogEngagement,
) {
  const key = QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug)
  const snapshot = qc.getQueryData<BlogEngagement>(key)
  if (snapshot) qc.setQueryData<BlogEngagement>(key, updater(snapshot))
  return snapshot
}

function patchMyEngagement(
  qc: ReturnType<typeof useQueryClient>,
  slug: string,
  updater: (data: MyEngagement) => MyEngagement,
) {
  const key = QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug)
  const snapshot = qc.getQueryData<MyEngagement>(key)
  if (snapshot) qc.setQueryData<MyEngagement>(key, updater(snapshot))
  return snapshot
}

export function useLikeBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.like(slug),
    onMutate: () => {
      const counters = patchCounters(qc, slug, (d) => ({ ...d, likesCount: d.likesCount + 1 }))
      const mine = patchMyEngagement(qc, slug, (d) => ({ ...d, isLiked: true }))
      return { counters, mine }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.counters) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug), ctx.counters)
      if (ctx?.mine) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug), ctx.mine)
    },
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useUnlikeBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.unlike(slug),
    onMutate: () => {
      const counters = patchCounters(qc, slug, (d) => ({ ...d, likesCount: Math.max(0, d.likesCount - 1) }))
      const mine = patchMyEngagement(qc, slug, (d) => ({ ...d, isLiked: false }))
      return { counters, mine }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.counters) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug), ctx.counters)
      if (ctx?.mine) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug), ctx.mine)
    },
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useSaveBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.save(slug),
    onMutate: () => {
      const counters = patchCounters(qc, slug, (d) => ({ ...d, savesCount: d.savesCount + 1 }))
      const mine = patchMyEngagement(qc, slug, (d) => ({ ...d, isSaved: true }))
      return { counters, mine }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.counters) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug), ctx.counters)
      if (ctx?.mine) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug), ctx.mine)
    },
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useUnsaveBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => engagementService.unsave(slug),
    onMutate: () => {
      const counters = patchCounters(qc, slug, (d) => ({ ...d, savesCount: Math.max(0, d.savesCount - 1) }))
      const mine = patchMyEngagement(qc, slug, (d) => ({ ...d, isSaved: false }))
      return { counters, mine }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.counters) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug), ctx.counters)
      if (ctx?.mine) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.MY_BY_SLUG(slug), ctx.mine)
    },
    onSettled: () => invalidateEngagement(qc, slug),
  })
}

export function useShareBlog(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (channel?: string) => engagementService.share(slug, channel),
    onMutate: () => {
      const counters = patchCounters(qc, slug, (d) => ({ ...d, sharesCount: d.sharesCount + 1 }))
      return { counters }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.counters) qc.setQueryData(QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug), ctx.counters)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENT.BY_SLUG(slug) }),
  })
}

export function useRecordView(slug: string) {
  return useMutation({
    mutationFn: (payload?: { source?: 'explore' | 'search' | 'direct' | 'tag' | 'profile' }) =>
      engagementService.recordView(slug, payload),
  })
}
