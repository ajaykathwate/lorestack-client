import { apiClient } from '@/api/client/axiosInstance'
import type { Tag, ApiResponse } from '@/types/api'

export const tagService = {
  list: () =>
    apiClient.get<ApiResponse<Tag[]>>('/tags'),

  trending: () =>
    apiClient.get<ApiResponse<Tag[]>>('/tags/trending'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Tag>>(`/tags/${slug}`),

  approve: (id: string) =>
    apiClient.post<ApiResponse<Tag>>(`/tags/${id}/approve`),

  follow: (id: string) =>
    apiClient.post<ApiResponse<{ followersCount: number }>>(`/tags/${id}/follow`),

  unfollow: (id: string) =>
    apiClient.delete<ApiResponse<{ followersCount: number }>>(`/tags/${id}/follow`),
}
