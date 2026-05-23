import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, SearchResult, SearchType } from '@/types/api'

export const searchService = {
  search: (q: string, type: SearchType = 'all') =>
    apiClient.get<ApiResponse<SearchResult>>('/search', { params: { q, type } }),
}
