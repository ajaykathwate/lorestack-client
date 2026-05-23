import { useQuery } from '@tanstack/react-query'
import { companyService } from '@/api/services/companyService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useAllCompanies(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['companies', 'all', params] as const,
    queryFn: () => companyService.getAll(params).then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
  })
}

export function useMyCompanies() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.COMPANIES.MINE,
    queryFn: () => companyService.getMine().then((r) => r.data.data),
    enabled: isAuthenticated,
  })
}

export function useCompanyByHandle(handle: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANIES.BY_HANDLE(handle),
    queryFn: () => companyService.getByHandle(handle).then((r) => r.data.data),
    enabled: !!handle,
  })
}

export function useCompanyMembers(handle: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANIES.MEMBERS(handle),
    queryFn: () => companyService.getMembers(handle).then((r) => r.data.data),
    enabled: !!handle,
  })
}

export function useCompanyMilestones(handle: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANIES.MILESTONES(handle),
    queryFn: () => companyService.getMilestones(handle).then((r) => r.data.data),
    enabled: !!handle,
  })
}
