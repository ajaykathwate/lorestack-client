import { apiClient } from '@/api/client/axiosInstance'
import type { ApiResponse, BlogEngagement, MyEngagement } from '@/types/api'

interface RecordViewPayload {
  sessionId?: string
  source?: 'explore' | 'search' | 'direct' | 'tag' | 'profile'
  referrer?: string
  device?: 'mobile' | 'desktop' | 'tablet'
}

interface ReadSessionPayload {
  sessionId: string
  maxScrollDepth: number
  readDurationSeconds: number
}

export const engagementService = {
  getCounters: (slug: string) =>
    apiClient.get<ApiResponse<BlogEngagement>>(`/blogs/${slug}/engagement`),

  getMyEngagement: (slug: string) =>
    apiClient.get<ApiResponse<MyEngagement>>(`/blogs/${slug}/my-engagement`),

  recordView: (slug: string, payload?: RecordViewPayload) =>
    apiClient.post<ApiResponse<{ recorded: boolean }>>(`/blogs/${slug}/view`, payload),

  updateReadSession: (slug: string, payload: ReadSessionPayload) =>
    apiClient.post<ApiResponse<{ recorded: boolean }>>(`/blogs/${slug}/read-session`, payload),

  like: (slug: string) =>
    apiClient.post<ApiResponse<{ likesCount: number }>>(`/blogs/${slug}/like`),

  unlike: (slug: string) =>
    apiClient.delete<ApiResponse<{ likesCount: number }>>(`/blogs/${slug}/like`),

  save: (slug: string) =>
    apiClient.post<ApiResponse<{ savesCount: number }>>(`/blogs/${slug}/save`),

  unsave: (slug: string) =>
    apiClient.delete<ApiResponse<{ savesCount: number }>>(`/blogs/${slug}/save`),

  share: (slug: string, channel?: string) =>
    apiClient.post<ApiResponse<{ sharesCount: number }>>(`/blogs/${slug}/share`, channel ? { channel } : undefined),
}
