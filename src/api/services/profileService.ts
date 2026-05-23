import { apiClient } from '@/api/client/axiosInstance'
import type { AuthorProfile, UpdateProfilePayload, ApiResponse, PaginatedResult, BlogSummary } from '@/types/api'

export const profileService = {
  getMe: () =>
    apiClient.get<ApiResponse<AuthorProfile>>('/author-profiles/me'),

  updateMe: (payload: UpdateProfilePayload) =>
    apiClient.patch<ApiResponse<AuthorProfile>>('/author-profiles/me', payload),

  getByUsername: (username: string) =>
    apiClient.get<ApiResponse<AuthorProfile>>(`/author-profiles/${username}`),

  getBlogsByUsername: (username: string) =>
    apiClient.get<ApiResponse<PaginatedResult<BlogSummary>>>(`/author-profiles/${username}/blogs`),

  follow: (authorProfileId: string) =>
    apiClient.post<ApiResponse<{ followersCount: number }>>(`/author-profiles/${authorProfileId}/follow`),

  unfollow: (authorProfileId: string) =>
    apiClient.delete<ApiResponse<{ followersCount: number }>>(`/author-profiles/${authorProfileId}/follow`),
}
