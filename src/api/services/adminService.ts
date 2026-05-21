import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse } from '@/types/api'
import type {
  AdminStats,
  ModerationItem,
  FeaturedCompany,
  AdminTag,
  AdminUser,
  AdminCompany,
  AdminReport,
  AuditLogEntry,
} from '@/types/api/admin'

export const adminService = {
  // ── Stats (no backend endpoint yet) ───────────────────────────────────────
  getStats: () =>
    apiClient.get<ApiResponse<AdminStats>>('/admin/stats'),

  getAuditLog: () =>
    apiClient.get<ApiResponse<AuditLogEntry[]>>('/admin/audit-log'),

  // ── Moderation (no backend endpoint yet) ──────────────────────────────────
  getModerationQueue: () =>
    apiClient.get<ApiResponse<ModerationItem[]>>('/admin/moderation'),

  approveItem: (id: string) =>
    apiClient.post<ApiResponse<ModerationItem>>(`/admin/moderation/${id}/approve`),

  rejectItem: (id: string) =>
    apiClient.post<ApiResponse<ModerationItem>>(`/admin/moderation/${id}/reject`),

  // ── Featured (no backend endpoint yet) ────────────────────────────────────
  getFeatured: () =>
    apiClient.get<ApiResponse<FeaturedCompany[]>>('/admin/featured'),

  addFeatured: (companyId: string) =>
    apiClient.post<ApiResponse<FeaturedCompany>>('/admin/featured', { companyId }),

  removeFeatured: (id: string) =>
    apiClient.delete(`/admin/featured/${id}`),

  reorderFeatured: (ids: string[]) =>
    apiClient.put('/admin/featured/reorder', { ids }),

  // ── Tags — GET /tags (public, approved only); approve via POST /tags/:id/approve ──
  getAdminTags: () =>
    apiClient.get<ApiResponse<AdminTag[]>>('/tags'),

  // POST /tags/:id/approve — requires platform_admin role
  approveTag: (id: string) =>
    apiClient.post<ApiResponse<AdminTag>>(`/tags/${id}/approve`),

  // No delete/merge endpoints documented yet
  deleteTag: (id: string) =>
    apiClient.delete(`/admin/tags/${id}`),

  mergeTags: (sourceId: string, targetSlug: string) =>
    apiClient.post('/admin/tags/merge', { sourceId, targetSlug }),

  // ── Users — GET /users (admin only), PATCH /users/:id for suspend ─────────
  // GET /users?page=1&limit=20 — platform_admin only, regular users get 403
  getAdminUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<AdminUser[]>>('/users', { params }),

  // Suspend via PATCH /users/:id — admin can patch any user
  suspendUser: (id: string) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}`, { isActive: false }),

  unsuspendUser: (id: string) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}`, { isActive: true }),

  // No promote/demote endpoints documented yet
  promoteAdmin: (id: string) =>
    apiClient.post(`/admin/users/${id}/promote`),

  demoteAdmin: (id: string) =>
    apiClient.post(`/admin/users/${id}/demote`),

  // ── Companies (no backend endpoint yet) ───────────────────────────────────
  getAdminCompanies: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<AdminCompany[]>>('/admin/companies', { params }),

  toggleCompanyVisibility: (id: string) =>
    apiClient.post(`/admin/companies/${id}/toggle-visibility`),

  deleteCompany: (id: string) =>
    apiClient.delete(`/admin/companies/${id}`),

  // ── Reports (no backend endpoint yet) ────────────────────────────────────
  getReports: (params?: { status?: string }) =>
    apiClient.get<ApiResponse<AdminReport[]>>('/admin/reports', { params }),

  resolveReport: (id: string) =>
    apiClient.post(`/admin/reports/${id}/resolve`),

  dismissReport: (id: string) =>
    apiClient.post(`/admin/reports/${id}/dismiss`),
}
