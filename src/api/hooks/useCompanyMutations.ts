import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService } from '@/api/services/companyService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type {
  CreateCompanyPayload,
  UpdateCompanyPayload,
  InviteAuthorPayload,
  AddMilestonePayload,
} from '@/types/api'

export function useCreateCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) =>
      companyService.create(payload).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.MINE })
    },
  })
}

export function useUpdateCompany(handle: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) =>
      companyService.update(handle, payload).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.BY_HANDLE(handle) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.MINE })
    },
  })
}

export function useInviteAuthor(handle: string) {
  return useMutation({
    mutationFn: (payload: InviteAuthorPayload) =>
      companyService.inviteAuthor(handle, payload),
  })
}

export function useRemoveMember(handle: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => companyService.removeMember(handle, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.MEMBERS(handle) })
    },
  })
}

export function useAcceptInvite() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (token: string) =>
      companyService.acceptInvite(token).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.MINE })
    },
  })
}

export function useDeclineInvite() {
  return useMutation({
    mutationFn: (token: string) => companyService.declineInvite(token),
  })
}

export function useAddMilestone(handle: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddMilestonePayload) =>
      companyService.addMilestone(handle, payload).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.MILESTONES(handle) })
    },
  })
}
