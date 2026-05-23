import { useMutation } from '@tanstack/react-query'
import { tagService } from '@/api/services/tagService'

export function useFollowTag() {
  return useMutation({
    mutationFn: (id: string) => tagService.follow(id).then((r) => r.data.data),
  })
}

export function useUnfollowTag() {
  return useMutation({
    mutationFn: (id: string) => tagService.unfollow(id).then((r) => r.data.data),
  })
}
