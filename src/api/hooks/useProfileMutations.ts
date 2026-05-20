import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/api/services/profileService'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { UpdateProfilePayload } from '@/types/api'

export function useUpdateProfile() {
  const { setAuthorProfile } = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateMe(payload).then((r) => r.data.data),
    onSuccess: (profile) => {
      setAuthorProfile(profile)
      qc.invalidateQueries({ queryKey: QUERY_KEYS.AUTHOR_PROFILES.ME })
    },
  })
}
