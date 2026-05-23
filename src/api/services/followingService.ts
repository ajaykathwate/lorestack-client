import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, AuthorProfile, Tag, Company } from '@/types/api'

export const followingService = {
  getAuthors: () =>
    apiClient.get<ApiResponse<AuthorProfile[]>>('/me/following/authors'),

  getTags: () =>
    apiClient.get<ApiResponse<Tag[]>>('/me/following/tags'),

  getCompanies: () =>
    apiClient.get<ApiResponse<Company[]>>('/me/following/companies'),
}
