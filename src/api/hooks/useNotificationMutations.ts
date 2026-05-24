import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '@/api/services/notificationsService'
import { useNotificationsStore } from '@/store/notificationsStore'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { NotificationListResponse } from '@/types/api'

/** Patch a single page's cached data. Silently skips if the cache entry has an unexpected shape. */
function patchPage(
  old: NotificationListResponse | undefined,
  updater: (data: NotificationListResponse['data']) => NotificationListResponse['data'],
): NotificationListResponse | undefined {
  if (!old || !Array.isArray(old.data)) return old
  return { ...old, data: updater(old.data) }
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  const { decrementUnread, markLiveItemRead } = useNotificationsStore()

  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),

    onMutate: (id) => {
      // Immediately mark as read in every cached page
      qc.setQueriesData<NotificationListResponse>(
        { queryKey: ['notifications'] },
        (old) => patchPage(old, (items) =>
          items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        ),
      )
      // Mirror into live WS items so the drawer re-render is instant
      markLiveItemRead(id)
      decrementUnread()
    },

    onError: () => {
      // Rollback: let server truth win on next refetch
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  const { resetUnread } = useNotificationsStore()

  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),

    onMutate: () => {
      qc.setQueriesData<NotificationListResponse>(
        { queryKey: ['notifications'] },
        (old) => patchPage(old, (items) =>
          items.map((n) => ({ ...n, isRead: true })),
        ),
      )
      resetUnread()
    },

    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteNotification() {
  const qc = useQueryClient()
  const { removeLiveItem, decrementUnread } = useNotificationsStore()

  return useMutation({
    mutationFn: (id: string) => notificationsService.deleteOne(id),

    onMutate: (id) => {
      // Find the notification to know if it was unread before removing
      const page1 = qc.getQueryData<NotificationListResponse>(QUERY_KEYS.NOTIFICATIONS.LIST(1))
      const wasUnread = page1?.data.find((n) => n.id === id && !n.isRead)

      // Remove from every cached page immediately
      qc.setQueriesData<NotificationListResponse>(
        { queryKey: ['notifications'] },
        (old) => patchPage(old, (items) => items.filter((n) => n.id !== id)),
      )

      removeLiveItem(id)
      if (wasUnread) decrementUnread()
    },

    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteAllNotifications() {
  const qc = useQueryClient()
  const { resetUnread, clearLiveItems } = useNotificationsStore()

  return useMutation({
    mutationFn: () => notificationsService.deleteAll(),

    onMutate: () => {
      qc.setQueriesData<NotificationListResponse>(
        { queryKey: ['notifications'] },
        (old) => patchPage(old, () => []),
      )
      clearLiveItems()
      resetUnread()
    },

    onError: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
