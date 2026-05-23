import { useQuery } from '@tanstack/react-query'
import { followingService } from '@/api/services/followingService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useFollowingAuthors() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.FOLLOWING.AUTHORS,
    queryFn: () => followingService.getAuthors().then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}

export function useFollowingTags() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.FOLLOWING.TAGS,
    queryFn: () => followingService.getTags().then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}

export function useFollowingCompanies() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.FOLLOWING.COMPANIES,
    queryFn: () => followingService.getCompanies().then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}
