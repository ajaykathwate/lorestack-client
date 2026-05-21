import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/api/services/adminService'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useApproveModerationItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.approveItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.MODERATION })
      toast.success('Item approved.')
    },
    onError: () => toast.error('Failed to approve item.'),
  })
}

export function useRejectModerationItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.rejectItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.MODERATION })
      toast.success('Item rejected.')
    },
    onError: () => toast.error('Failed to reject item.'),
  })
}

export function useAddFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (companyId: string) => adminService.addFeatured(companyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.FEATURED })
      toast.success('Company added to featured.')
    },
    onError: () => toast.error('Failed to add featured company.'),
  })
}

export function useRemoveFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.removeFeatured(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.FEATURED })
      toast.success('Company removed from featured.')
    },
    onError: () => toast.error('Failed to remove company.'),
  })
}

export function useApproveTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.approveTag(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TAGS })
      toast.success('Tag approved.')
    },
    onError: () => toast.error('Failed to approve tag.'),
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteTag(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TAGS })
      toast.success('Tag deleted.')
    },
    onError: () => toast.error('Failed to delete tag.'),
  })
}

export function useMergeTags() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sourceId, targetSlug }: { sourceId: string; targetSlug: string }) =>
      adminService.mergeTags(sourceId, targetSlug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TAGS })
      toast.success('Tags merged. Old URL now redirects.')
    },
    onError: () => toast.error('Failed to merge tags.'),
  })
}

export function useSuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.suspendUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS })
      toast.success('User suspended.')
    },
    onError: () => toast.error('Failed to suspend user.'),
  })
}

export function useUnsuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.unsuspendUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS })
      toast.success('User unsuspended.')
    },
    onError: () => toast.error('Failed to unsuspend user.'),
  })
}

export function useResolveReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.resolveReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.REPORTS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.MODERATION })
      toast.success('Report resolved.')
    },
    onError: () => toast.error('Failed to resolve report.'),
  })
}

export function useDismissReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.dismissReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.REPORTS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.MODERATION })
      toast.success('Report dismissed.')
    },
    onError: () => toast.error('Failed to dismiss report.'),
  })
}
