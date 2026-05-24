import { apiClient } from '@/api/client/axiosInstance'
import type {
  ApiResponse,
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
  DeleteAllResponse,
} from '@/types/api'

export const notificationsService = {
  list: (page = 1, limit = 20) =>
    apiClient.get<ApiResponse<NotificationListResponse>>('/notifications', {
      params: { page, limit },
    }),

  unreadCount: () =>
    apiClient.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count'),

  markRead: (id: string) =>
    apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllRead: () =>
    apiClient.post<ApiResponse<void>>('/notifications/read-all'),

  deleteOne: (id: string) =>
    apiClient.delete<void>(`/notifications/${id}`),

  deleteAll: () =>
    apiClient.delete<ApiResponse<DeleteAllResponse>>('/notifications'),
}
