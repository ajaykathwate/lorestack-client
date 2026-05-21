import { useQuery } from '@tanstack/react-query'
import { profileService } from '@/api/services/profileService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useMyProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.AUTHOR_PROFILES.ME,
    queryFn: () => profileService.getMe().then((r) => r.data.data),
    enabled: isAuthenticated,
  })
}

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHOR_PROFILES.BY_USERNAME(username),
    queryFn: () => profileService.getByUsername(username).then((r) => r.data.data),
    enabled: !!username,
  })
}

export function useAuthorBlogs(username: string) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHOR_PROFILES.BLOGS(username),
    queryFn: () => profileService.getBlogsByUsername(username).then((r) => r.data.data.data),
    enabled: !!username,
  })
}
