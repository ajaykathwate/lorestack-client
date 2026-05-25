import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Trash2, X, Loader2 } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useNotificationsStore } from '@/store/notificationsStore'
import { useNotifications } from '@/api/hooks/useNotificationQueries'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '@/api/hooks/useNotificationMutations'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import { cn, formatInstagramTime, notifDeepLink, notifAvatar, notifAvatarName } from '@/lib/utils'
import type { Notification, NotificationPush } from '@/types/api'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function NotificationDrawer({ onClose }: { onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data: page1, isLoading } = useNotifications(1)
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead()
  const { mutate: deleteOne } = useDeleteNotification()
  const { mutate: deleteAll, isPending: deletingAll } = useDeleteAllNotifications()
  const { unreadCount, liveItems } = useNotificationsStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Focus first focusable element on mount
  useEffect(() => {
    const el = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    el?.focus()
  }, [])

  // Focus trap — keep Tab/Shift+Tab cycling inside the drawer
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const drawer = drawerRef.current
      if (!drawer) return
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest('[hidden]') && el.offsetParent !== null,
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const restItems: Notification[] = page1?.data ?? []
  const restIds = new Set(restItems.map((n) => n.id))
  const items: (Notification | NotificationPush)[] = [
    ...liveItems.filter((n) => !n.id || !restIds.has(n.id)),
    ...restItems,
  ]

  function handleItemClick(n: Notification | NotificationPush) {
    if (n.id && !n.isRead) markRead(n.id)
    const link = notifDeepLink(n)
    if (link) { navigate(link); onClose() }
  }

  function handleMarkRead(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    markRead(id)
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    deleteOne(id)
  }

  function handleDeleteAll() {
    setShowClearConfirm(false)
    deleteAll()
  }

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
      className="fixed z-50 bg-bg border border-line rounded-[8px] flex flex-col"
      style={{
        top: 62,
        right: 16,
        width: 'min(368px, calc(100vw - 32px))',
        maxHeight: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,.14), 0 2px 8px rgba(0,0,0,.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="flex items-center flex-shrink-0 border-b border-line" style={{ padding: '11px 14px', gap: 8 }}>
        <span className="font-semibold text-ink" style={{ fontSize: 14 }}>Notifications</span>
        {unreadCount > 0 && (
          <span
            className="bg-ls-accent text-white rounded-full font-mono leading-none"
            style={{ fontSize: 10, padding: '2px 6px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        <div className="flex-1" />
        {unreadCount > 0 && (
          <button
            onClick={() => markAll()}
            disabled={markingAll}
            className="flex items-center gap-1 text-ink-3 hover:text-ink transition-colors rounded-[4px] hover:bg-bg-tint"
            style={{ padding: '4px 7px', fontSize: 11 }}
          >
            {markingAll ? <Loader2 size={11} className="animate-spin" /> : <CheckCheck size={12} />}
            <span>Mark all read</span>
          </button>
        )}
        {items.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-ink-3 hover:text-red-500 transition-colors rounded-[4px] hover:bg-bg-tint p-1"
            aria-label="Delete all notifications"
          >
            <Trash2 size={13} />
          </button>
        )}
        <button onClick={onClose} className="text-ink-3 hover:text-ink transition-colors p-0.5" aria-label="Close notifications">
          <X size={14} />
        </button>
      </div>

      {/* Clear-all confirmation */}
      {showClearConfirm && (
        <div className="flex items-center justify-between border-b border-line bg-bg-soft flex-shrink-0" style={{ padding: '9px 14px', gap: 10 }}>
          <p className="text-ink-2" style={{ fontSize: 12 }}>Delete all notifications?</p>
          <div className="flex" style={{ gap: 6 }}>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="border border-line text-ink-2 hover:text-ink rounded-[4px] transition-colors"
              style={{ padding: '4px 10px', fontSize: 11 }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="bg-red-500 text-white rounded-[4px] hover:bg-red-600 transition-colors flex items-center gap-1"
              style={{ padding: '4px 10px', fontSize: 11 }}
            >
              {deletingAll && <Loader2 size={10} className="animate-spin" />}
              Delete all
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && items.length === 0 ? (
          <div style={{ padding: 14 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center animate-pulse" style={{ gap: 10, padding: '10px 0' }}>
                <div className="rounded-full bg-bg-tint flex-shrink-0" style={{ width: 34, height: 34 }} />
                <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="rounded bg-bg-tint" style={{ height: 11, width: '78%' }} />
                  <div className="rounded bg-bg-tint" style={{ height: 9, width: '32%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ padding: '40px 20px', gap: 10 }}>
            <Bell size={28} className="text-ink-3" style={{ opacity: 0.35 }} />
            <p className="font-medium text-ink-2" style={{ fontSize: 13 }}>No notifications yet</p>
            <p className="text-ink-3" style={{ fontSize: 12 }}>
              You're all caught up — we'll notify you when something happens.
            </p>
          </div>
        ) : (
          items.slice(0, 20).map((n, i) => {
            const isRead = !!n.isRead
            const avatar = notifAvatar(n)
            const name = notifAvatarName(n)
            const link = notifDeepLink(n)

            return (
              <div
                key={n.id ?? `live-${i}`}
                onClick={() => handleItemClick(n)}
                className={cn(
                  'flex items-start group border-b border-line last:border-b-0 transition-colors',
                  !isRead ? 'bg-ls-accent/[0.04] hover:bg-ls-accent/[0.07]' : 'hover:bg-bg-soft',
                  link && 'cursor-pointer',
                )}
                style={{ padding: '11px 14px', gap: 10 }}
              >
                <div className="flex-shrink-0 flex items-center" style={{ width: 7, paddingTop: 10 }}>
                  {!isRead && (
                    <span className="block rounded-full bg-ls-accent" style={{ width: 6, height: 6 }} />
                  )}
                </div>

                <UserAvatar avatarUrl={avatar} name={name} size={32} />

                <div className="flex-1 min-w-0">
                  <p
                    className={cn('text-ink leading-snug', !isRead && 'font-medium')}
                    style={{ fontSize: 12.5 }}
                  >
                    {n.message}
                  </p>
                  {n.createdAt && (
                    <p className="text-ls-accent font-mono" style={{ fontSize: 10.5, marginTop: 3 }}>
                      {formatInstagramTime(n.createdAt)}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ paddingTop: 2 }}>
                  {!isRead && n.id && (
                    <button
                      onClick={(e) => handleMarkRead(e, n.id!)}
                      className="p-1 rounded text-ink-3 hover:text-ls-accent hover:bg-bg-tint transition-colors"
                      aria-label="Mark as read"
                    >
                      <CheckCheck size={12} />
                    </button>
                  )}
                  {n.id && (
                    <button
                      onClick={(e) => handleDelete(e, n.id!)}
                      className="p-1 rounded text-ink-3 hover:text-red-500 hover:bg-bg-tint transition-colors"
                      aria-label="Delete notification"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <Link
        to={ROUTES.NOTIFICATIONS}
        onClick={onClose}
        className="flex-shrink-0 flex items-center justify-center border-t border-line text-ink-2 hover:text-ink hover:bg-bg-soft transition-colors font-medium"
        style={{ padding: '10px 14px', fontSize: 12 }}
      >
        See all notifications
      </Link>
    </div>
  )
}
