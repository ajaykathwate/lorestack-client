import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, PlatformStats } from '@/types/api'

export const statsService = {
  get: () =>
    apiClient.get<ApiResponse<PlatformStats>>('/stats'),
}
