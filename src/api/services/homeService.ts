import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, HomePayload } from '@/types/api'

export const homeService = {
  get: () =>
    apiClient.get<ApiResponse<HomePayload>>('/home'),
}
