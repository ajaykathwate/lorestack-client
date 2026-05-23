import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, PaginatedResult, BlogSummary } from '@/types/api'

export const savedService = {
  getSaved: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResult<BlogSummary>>>('/me/saved', { params }),
}
