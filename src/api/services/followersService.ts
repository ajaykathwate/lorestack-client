import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, AuthorProfile } from '@/types/api'

export const followersService = {
  getAuthors: () =>
    apiClient.get<ApiResponse<AuthorProfile[]>>('/me/followers/authors'),
}
