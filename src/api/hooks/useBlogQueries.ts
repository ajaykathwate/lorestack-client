import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/api/services/blogService'
import { companyService } from '@/api/services/companyService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'
import type { ExploreParams } from '@/types/api'

export function useMyBlogs() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.BLOGS.MINE,
    queryFn: () => blogService.getMyBlogs().then((r) => r.data.data.data),
    enabled: isAuthenticated,
  })
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BLOGS.BY_SLUG(slug),
    queryFn: () => blogService.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  })
}

// For editing: tries the private endpoint first (/blogs/me/:slug), falls back
// to the public endpoint which the authenticated apiClient can also serve for
// the owner's own drafts on some backend configurations.
export function useEditableBlog(slug: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: [...QUERY_KEYS.BLOGS.BY_SLUG(slug), 'editable'] as const,
    queryFn: async () => {
      try {
        return await blogService.getMyBlogBySlug(slug).then((r) => r.data.data)
      } catch {
        return blogService.getBySlug(slug).then((r) => r.data.data)
      }
    },
    enabled: !!slug && isAuthenticated,
    retry: false,
    staleTime: 0,
  })
}

export function useExplore(params?: ExploreParams) {
  return useQuery({
    queryKey: QUERY_KEYS.BLOGS.EXPLORE((params ?? {}) as Record<string, unknown>),
    queryFn: () => blogService.explore(params).then((r) => r.data.data.data),
  })
}

export function useCompanyBlogs(handle: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BLOGS.COMPANY(handle),
    queryFn: () => companyService.getBlogs(handle).then((r) => r.data.data.data),
    enabled: !!handle,
  })
}
