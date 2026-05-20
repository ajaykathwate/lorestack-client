import { apiClient } from '@/api/client/axiosInstance'
import type {
  Company,
  CompanyMember,
  CompanyMilestone,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  InviteAuthorPayload,
  AddMilestonePayload,
  ApiResponse,
  BlogSummary,
} from '@/types/api'

export const companyService = {
  create: (payload: CreateCompanyPayload) =>
    apiClient.post<ApiResponse<Company>>('/companies', payload),

  getMine: () =>
    apiClient.get<ApiResponse<Company[]>>('/companies/mine'),

  getByHandle: (handle: string) =>
    apiClient.get<ApiResponse<Company>>(`/companies/${handle}`),

  update: (handle: string, payload: UpdateCompanyPayload) =>
    apiClient.patch<ApiResponse<Company>>(`/companies/${handle}`, payload),

  getMembers: (handle: string) =>
    apiClient.get<ApiResponse<CompanyMember[]>>(`/companies/${handle}/members`),

  removeMember: (handle: string, userId: string) =>
    apiClient.delete(`/companies/${handle}/members/${userId}`),

  inviteAuthor: (handle: string, payload: InviteAuthorPayload) =>
    apiClient.post(`/companies/${handle}/invites`, payload),

  acceptInvite: (token: string) =>
    apiClient.post<ApiResponse<Company>>(`/companies/invites/${token}/accept`),

  declineInvite: (token: string) =>
    apiClient.post(`/companies/invites/${token}/decline`),

  addMilestone: (handle: string, payload: AddMilestonePayload) =>
    apiClient.post<ApiResponse<CompanyMilestone>>(`/companies/${handle}/milestones`, payload),

  getMilestones: (handle: string) =>
    apiClient.get<ApiResponse<CompanyMilestone[]>>(`/companies/${handle}/milestones`),

  getBlogs: (handle: string) =>
    apiClient.get<ApiResponse<BlogSummary[]>>(`/companies/${handle}/blogs`),
}
