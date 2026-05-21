import { useState } from 'react'
import { useAdminUsers } from '@/api/hooks/useAdminQueries'
import { useSuspendUser, useUnsuspendUser } from '@/api/hooks/useAdminMutations'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { formatDateShort, initials } from '@/lib/utils'

export function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const { data: users, isLoading } = useAdminUsers({ search: search || undefined })
  const { mutate: suspend } = useSuspendUser()
  const { mutate: unsuspend } = useUnsuspendUser()

  const list = users ?? []

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Users</h1>
          <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
            {list.length} users · manage accounts, roles, and access.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="⌕ search by email or username"
          className="border border-line rounded-[4px] text-ink bg-bg placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
          style={{ padding: '6px 10px', fontSize: 12, minWidth: 240 }}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spinner size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 48 }}>
          <p className="text-ink-3" style={{ fontSize: 13 }}>
            {search ? `No users matching "${search}".` : 'No users found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {/* Column headers */}
          <div
            className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line-soft"
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr 180px 80px 110px 160px', padding: '8px 14px', gap: 10, fontSize: 10, letterSpacing: '0.5px' }}
          >
            <span />
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {list.map((user, i) => (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 180px 80px 110px 160px',
                padding: '12px 14px',
                gap: 10,
                alignItems: 'center',
                borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : undefined,
                fontSize: 12,
                opacity: user.isActive ? 1 : 0.6,
              }}
            >
              <div
                className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2"
                style={{ width: 28, height: 28, fontSize: 10 }}
              >
                {user.displayName ? initials(user.displayName) : user.email[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-ink" style={{ fontSize: 13 }}>
                  {user.displayName ?? user.email.split('@')[0]}
                </div>
                {user.username && (
                  <div className="font-mono text-ink-3" style={{ fontSize: 10, marginTop: 1 }}>@{user.username}</div>
                )}
              </div>
              <span className="font-mono text-ink-2 truncate" style={{ fontSize: 11 }}>{user.email}</span>
              <span
                className="font-mono rounded-[3px] text-center"
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  background: user.platformRole === 'platform_admin' ? 'var(--ls-ink)' : 'var(--ls-bg-soft)',
                  color: user.platformRole === 'platform_admin' ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
                  border: '1px solid var(--ls-line)',
                }}
              >
                {user.platformRole === 'platform_admin' ? 'Admin' : 'User'}
              </span>
              <span className="text-ink-3">{formatDateShort(user.createdAt)}</span>
              <div className="flex justify-end" style={{ gap: 6 }}>
                {!user.isActive ? (
                  <button
                    onClick={() => unsuspend(user.id)}
                    className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors"
                    style={{ padding: '3px 8px', fontSize: 11 }}
                  >
                    Unsuspend
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm(`Suspend ${user.email}?`)) suspend(user.id)
                    }}
                    className="border border-line text-ink-3 rounded-[3px] hover:text-red-500 hover:border-red-300 transition-colors"
                    style={{ padding: '3px 8px', fontSize: 11 }}
                  >
                    Suspend
                  </button>
                )}
                {!user.isActive && (
                  <span
                    className="font-mono rounded-[3px] text-center"
                    style={{ fontSize: 10, padding: '2px 6px', background: '#fee2e2', color: '#991b1b' }}
                  >
                    Suspended
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
