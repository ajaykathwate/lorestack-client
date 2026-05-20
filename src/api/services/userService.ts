import { apiClient } from '@/api/client/axiosInstance'
import type { User, ApiResponse } from '@/types/api'

export const userService = {
  getMe: () =>
    apiClient.get<ApiResponse<User>>('/users/me'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  listAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params }),

  update: (id: string, payload: { email?: string }) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
}
