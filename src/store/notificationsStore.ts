import { create } from 'zustand'
import type { NotificationPush } from '@/types/api'

interface NotificationsState {
  unreadCount: number
  liveItems: NotificationPush[]
}

interface NotificationsActions {
  setUnreadCount: (count: number) => void
  incrementUnread: () => void
  decrementUnread: () => void
  resetUnread: () => void
  addLiveItem: (item: NotificationPush) => void
  removeLiveItem: (id: string) => void
  markLiveItemRead: (id: string) => void
  clearLiveItems: () => void
}

export const useNotificationsStore = create<NotificationsState & NotificationsActions>((set) => ({
  unreadCount: 0,
  liveItems: [],

  setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  resetUnread: () => set({ unreadCount: 0 }),

  addLiveItem: (item) => set((s) => ({ liveItems: [item, ...s.liveItems] })),
  removeLiveItem: (id) => set((s) => ({ liveItems: s.liveItems.filter((n) => n.id !== id) })),
  markLiveItemRead: (id) =>
    set((s) => ({
      liveItems: s.liveItems.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),
  clearLiveItems: () => set({ liveItems: [] }),
}))
