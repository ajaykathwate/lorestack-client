import { useQuery } from '@tanstack/react-query'
import { followersService } from '@/api/services/followersService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useFollowerAuthors() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.FOLLOWERS.AUTHORS,
    queryFn: () => followersService.getAuthors().then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}
