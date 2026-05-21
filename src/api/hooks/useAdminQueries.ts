import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/api/services/adminService'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useAdminStats() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.STATS,
    queryFn: () => adminService.getStats().then((r) => r.data.data),
    retry: false,
  })
}

export function useAdminAuditLog() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.AUDIT_LOG,
    queryFn: () => adminService.getAuditLog().then((r) => r.data.data),
    retry: false,
  })
}

export function useAdminModerationQueue() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.MODERATION,
    queryFn: () => adminService.getModerationQueue().then((r) => r.data.data),
    retry: false,
  })
}

export function useAdminFeatured() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.FEATURED,
    queryFn: () => adminService.getFeatured().then((r) => r.data.data),
    retry: false,
  })
}

// GET /tags — returns all approved tags. No status filtering supported on this endpoint.
export function useAdminTags() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.TAGS,
    queryFn: () => adminService.getAdminTags().then((r) => r.data.data),
    retry: false,
  })
}

export function useAdminUsers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.USERS, params],
    queryFn: () => adminService.getAdminUsers(params).then((r) => r.data.data),
    retry: false,
  })
}

export function useAdminCompanies(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.COMPANIES, params],
    queryFn: () => adminService.getAdminCompanies(params).then((r) => r.data.data),
    retry: false,
  })
}

export function useAdminReports(status?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.REPORTS, status],
    queryFn: () => adminService.getReports({ status }).then((r) => r.data.data),
    retry: false,
  })
}
