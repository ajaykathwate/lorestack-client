import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Trash2, CheckCheck, Loader2, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { useNotifications } from '@/api/hooks/useNotificationQueries'
import {
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '@/api/hooks/useNotificationMutations'
import { useNotificationsStore } from '@/store/notificationsStore'
import { apiClient } from '@/api/client/axiosInstance'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import { cn } from '@/lib/utils'
import { formatInstagramTime, notifDeepLink, notifAvatar, notifAvatarName } from '@/shared/components/TopNav'
import type { Notification, NotificationPush, NotificationAction } from '@/types/api'

// ── Full relative time for the page (longer format) ───────────────────────────

function formatRelative(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) { const m = Math.floor(diff / 60); return `${m} min${m > 1 ? 's' : ''} ago` }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return `${h} hr${h > 1 ? 's' : ''} ago` }
  if (diff < 604800) { const d = Math.floor(diff / 86400); return `${d} day${d > 1 ? 's' : ''} ago` }
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDayLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86_400_000)
  const itemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  if (itemDay.getTime() === today.getTime()) return 'Today'
  if (itemDay.getTime() === yesterday.getTime()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

// ── Company invite action buttons ─────────────────────────────────────────────

function InviteActions({
  actions,
  notifId,
  onDone,
}: {
  actions: NotificationAction[]
  notifId: string
  onDone: () => void
}) {
  const [pending, setPending] = useState<string | null>(null)
  const { mutate: deleteOne } = useDeleteNotification()

  async function handleAction(action: NotificationAction) {
    setPending(action.label)
    try {
      await apiClient.post(action.url)
      toast.success(`${action.label}ed successfully`)
      deleteOne(notifId, { onSuccess: onDone })
    } catch {
      toast.error(`Failed to ${action.label.toLowerCase()} the invite`)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex" style={{ gap: 8, marginTop: 10 }}>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={(e) => { e.stopPropagation(); handleAction(action) }}
          disabled={!!pending}
          className={cn(
            'rounded-[5px] font-medium transition-colors flex items-center gap-1.5',
            action.style === 'primary'
              ? 'bg-ls-accent text-white hover:opacity-90'
              : 'border border-line text-ink-2 hover:text-ink hover:border-line-strong',
          )}
          style={{ padding: '6px 14px', fontSize: 12 }}
        >
          {pending === action.label && <Loader2 size={11} className="animate-spin" />}
          {action.label}
        </button>
      ))}
    </div>
  )
}

// ── Single notification row ───────────────────────────────────────────────────

function NotificationRow({
  notification,
  onRead,
  onDelete,
}: {
  notification: Notification | NotificationPush
  onRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const navigate = useNavigate()
  const isRead = !!notification.isRead
  const link = notifDeepLink(notification)
  const avatar = notifAvatar(notification)
  const name = notifAvatarName(notification)
  const actions = (notification.metadata?.actions as NotificationAction[] | undefined) ?? []
  const hasInviteActions = notification.type === 'company_invite_received' && actions.length > 0

  function handleClick() {
    if (hasInviteActions) return
    if (notification.id && !isRead) onRead(notification.id)
    if (link) navigate(link)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start group transition-colors',
        !isRead && 'bg-ls-accent/[0.04]',
        !hasInviteActions && 'cursor-pointer hover:bg-bg-soft',
      )}
      style={{ padding: '15px 20px', gap: 12 }}
    >
      {/* Unread dot */}
      <div className="flex-shrink-0 flex items-center" style={{ width: 8, paddingTop: 10 }}>
        {!isRead && (
          <span className="block rounded-full bg-ls-accent" style={{ width: 7, height: 7 }} />
        )}
      </div>

      {/* Avatar */}
      <UserAvatar avatarUrl={avatar} name={name} size={38} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn('text-ink leading-snug', !isRead && 'font-medium')}
          style={{ fontSize: 13 }}
        >
          {notification.message}
        </p>
        {notification.createdAt && (
          <p className="text-ls-accent font-mono" style={{ fontSize: 11, marginTop: 4 }}>
            {formatRelative(notification.createdAt)}
          </p>
        )}
        {hasInviteActions && notification.id && (
          <InviteActions
            actions={actions}
            notifId={notification.id}
            onDone={() => onDelete(notification.id!)}
          />
        )}
      </div>

      {/* Hover actions */}
      <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ paddingTop: 4 }}>
        {!isRead && notification.id && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(notification.id!) }}
            className="p-1.5 rounded text-ink-3 hover:text-ls-accent hover:bg-bg-tint transition-colors"
          >
            <CheckCheck size={14} />
          </button>
        )}
        {notification.id && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(notification.id!) }}
            className="p-1.5 rounded text-ink-3 hover:text-red-500 hover:bg-bg-tint transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex items-start animate-pulse" style={{ padding: '15px 20px', gap: 12 }}>
      <div style={{ width: 8 }} />
      <div className="rounded-full bg-bg-tint flex-shrink-0" style={{ width: 38, height: 38 }} />
      <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 2 }}>
        <div className="rounded bg-bg-tint" style={{ height: 13, width: '72%' }} />
        <div className="rounded bg-bg-tint" style={{ height: 10, width: '28%' }} />
      </div>
    </div>
  )
}

// ── Day section label ─────────────────────────────────────────────────────────

function DayLabel({ label }: { label: string }) {
  return (
    <div
      className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line"
      style={{ fontSize: 10, letterSpacing: '1.1px', padding: '6px 20px' }}
    >
      {label}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function NotificationsPage() {
  const { unreadCount, liveItems, removeLiveItem, clearLiveItems, resetUnread } = useNotificationsStore()

  const [page, setPage] = useState(1)
  const [allItems, setAllItems] = useState<Notification[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const { data: pageData, isLoading } = useNotifications(page)
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead()
  const { mutate: deleteOne } = useDeleteNotification()
  const { mutate: deleteAll, isPending: deletingAll } = useDeleteAllNotifications()

  // Accumulate pages (the query cache is the source of truth — mutations patch it optimistically)
  useEffect(() => {
    if (!pageData) return
    setAllItems((prev) => {
      if (page === 1) return pageData.data
      const existingIds = new Set(prev.map((n) => n.id))
      return [...prev, ...pageData.data.filter((n) => !existingIds.has(n.id))]
    })
    setHasNextPage(pageData.meta.hasNextPage)
  }, [pageData, page])

  // Merge live items + REST items, dedup
  const restIds = new Set(allItems.map((n) => n.id))
  const merged: (Notification | NotificationPush)[] = [
    ...liveItems.filter((n) => !n.id || !restIds.has(n.id)),
    ...allItems,
  ]

  // Group by day
  type Group = { label: string; items: (Notification | NotificationPush)[] }
  const groups: Group[] = []
  const groupMap = new Map<string, Group>()
  for (const item of merged) {
    const label = item.createdAt ? getDayLabel(item.createdAt) : 'Earlier'
    let g = groupMap.get(label)
    if (!g) { g = { label, items: [] }; groups.push(g); groupMap.set(label, g) }
    g.items.push(item)
  }

  function handleMarkRead(id: string) {
    markRead(id)
    // Also sync local allItems so the row updates without waiting for refetch
    setAllItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  function handleDelete(id: string) {
    deleteOne(id)
    removeLiveItem(id)
    setAllItems((prev) => prev.filter((n) => n.id !== id))
  }

  function handleMarkAll() {
    markAll()
    setAllItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  function handleDeleteAll() {
    setShowClearConfirm(false)
    deleteAll()
    setAllItems([])
    clearLiveItems()
    resetUnread()
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap" style={{ marginBottom: 20, gap: 12 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>You</span>
          <div className="flex items-center gap-3" style={{ marginTop: 4 }}>
            <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26 }}>Notifications</h1>
            {unreadCount > 0 && (
              <span
                className="inline-flex items-center bg-ls-accent text-white rounded-full font-mono"
                style={{ fontSize: 10, padding: '2px 8px' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {merged.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={markingAll}
                className="flex items-center gap-1.5 border border-line text-ink-2 hover:text-ink hover:border-line-strong rounded-[6px] transition-colors"
                style={{ padding: '7px 12px', fontSize: 12 }}
              >
                {markingAll ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={13} />}
                Mark all read
              </button>
            )}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 border border-line text-ink-2 hover:text-red-500 hover:border-red-200 rounded-[6px] transition-colors"
              style={{ padding: '7px 12px', fontSize: 12 }}
            >
              <Trash2 size={13} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Clear-all confirmation ── */}
      {showClearConfirm && (
        <div
          className="flex items-center justify-between flex-wrap border border-line rounded-[6px] bg-bg-soft"
          style={{ padding: '12px 16px', marginBottom: 16, gap: 12 }}
        >
          <p className="text-ink-2" style={{ fontSize: 13 }}>Delete all notifications? This cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="border border-line text-ink-2 hover:text-ink rounded-[5px] transition-colors"
              style={{ padding: '5px 12px', fontSize: 12 }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="bg-red-500 text-white rounded-[5px] hover:bg-red-600 transition-colors flex items-center gap-1.5"
              style={{ padding: '5px 14px', fontSize: 12 }}
            >
              {deletingAll && <Loader2 size={11} className="animate-spin" />}
              Delete all
            </button>
          </div>
        </div>
      )}

      {/* ── Notification list card ── */}
      <div className="border border-line rounded-[6px] overflow-hidden">
        {isLoading && page === 1 ? (
          <div className="divide-y divide-line">
            {[...Array(6)].map((_, i) => <NotificationSkeleton key={i} />)}
          </div>
        ) : merged.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ padding: '72px 24px', gap: 14 }}>
            <Bell size={36} className="text-ink-3" style={{ opacity: 0.3 }} />
            <div>
              <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>You're all caught up</h3>
              <p className="text-ink-2" style={{ fontSize: 13, marginTop: 6 }}>
                Notifications will appear here when people interact with your content.
              </p>
            </div>
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <div key={group.label}>
                <DayLabel label={group.label} />
                <div className="divide-y divide-line">
                  {group.items.map((n, i) => (
                    <NotificationRow
                      key={n.id ?? `live-${i}`}
                      notification={n}
                      onRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}

            {hasNextPage && (
              <div className="flex justify-center border-t border-line" style={{ padding: '14px' }}>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 border border-line text-ink-2 hover:text-ink hover:border-line-strong rounded-[6px] transition-colors"
                  style={{ padding: '7px 20px', fontSize: 12 }}
                >
                  {isLoading && <Loader2 size={12} className="animate-spin" />}
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
