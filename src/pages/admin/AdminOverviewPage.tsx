import { Link } from 'react-router-dom'
import { useAdminStats, useAdminModerationQueue, useAdminFeatured, useAdminAuditLog } from '@/api/hooks/useAdminQueries'
import { useApproveModerationItem, useRejectModerationItem } from '@/api/hooks/useAdminMutations'
import { ROUTES } from '@/constants/routes'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { formatDateShort } from '@/lib/utils'

export function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: queue } = useAdminModerationQueue()
  const { data: featured } = useAdminFeatured()
  const { data: auditLog } = useAdminAuditLog()

  const { mutate: approve, isPending: approving } = useApproveModerationItem()
  const { mutate: reject, isPending: rejecting } = useRejectModerationItem()

  const pendingItems = (queue ?? []).filter((i) => i.status === 'pending').slice(0, 4)
  const featuredList = featured ?? []
  const recentActions = auditLog ?? []

  const statCards = [
    { label: 'New users',     value: stats?.newUsers ?? '—',     sub: stats?.newUsersChange ?? '',     accent: false },
    { label: 'New blogs',     value: stats?.newBlogs ?? '—',     sub: stats?.newBlogsChange ?? '',     accent: false },
    { label: 'New companies', value: stats?.newCompanies ?? '—', sub: stats?.newCompaniesChange ?? '', accent: false },
    { label: 'Reports open',  value: stats?.openReports ?? '—',  sub: 'attention',                     accent: true  },
  ]

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Platform overview</h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>Snapshot of the last 7 days</p>
      </div>

      {/* Stat cards */}
      {statsLoading ? (
        <div className="flex items-center justify-center" style={{ height: 80 }}>
          <Spinner size="md" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {statCards.map(({ label, value, sub, accent }) => (
            <div key={label} className="rounded-[6px] border border-line bg-bg" style={{ padding: 14 }}>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>{label}</div>
              <div className="font-serif font-semibold text-ink" style={{ fontSize: 24, marginTop: 4 }}>{value}</div>
              <div style={{ fontSize: 11, marginTop: 2, color: accent ? 'var(--ls-accent)' : 'var(--ls-ink-3)' }}>{sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Two-column: moderation queue + featured companies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>
        {/* Moderation queue */}
        <div className="rounded-[6px] border border-line overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-soft" style={{ padding: '12px 14px' }}>
            <h3 className="font-serif font-semibold text-ink" style={{ fontSize: 14 }}>
              Moderation queue {pendingItems.length > 0 && <span className="text-ink-3 font-normal">· {pendingItems.length}</span>}
            </h3>
            <Link to={ROUTES.ADMIN_MODERATION} className="text-ls-accent" style={{ fontSize: 11 }}>
              View all →
            </Link>
          </div>

          {pendingItems.length === 0 ? (
            <div className="flex items-center justify-center text-ink-3" style={{ padding: '32px 14px', fontSize: 13 }}>
              No items pending review.
            </div>
          ) : (
            pendingItems.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 90px 90px',
                  padding: '10px 14px',
                  gap: 10,
                  alignItems: 'center',
                  borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : undefined,
                  fontSize: 12,
                }}
              >
                <span
                  className="font-mono rounded-[3px] text-center"
                  style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    background: item.type === 'report' ? 'var(--ls-accent-soft)' : 'var(--ls-bg-soft)',
                    color: item.type === 'report' ? 'var(--ls-accent-ink)' : 'var(--ls-ink-2)',
                    border: '1px solid',
                    borderColor: item.type === 'report' ? 'var(--ls-accent-soft)' : 'var(--ls-line)',
                  }}
                >
                  {item.type === 'report' ? 'REPORT' : item.type === 'new_tag' ? 'NEW TAG' : 'USER'}
                </span>
                <div>
                  <div className="font-serif text-ink truncate" style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</div>
                  <div className="text-ink-3" style={{ fontSize: 10, marginTop: 2 }}>{item.reason}</div>
                </div>
                <button
                  onClick={() => approve(item.id)}
                  disabled={approving}
                  className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors disabled:opacity-50 text-center"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => reject(item.id)}
                  disabled={rejecting}
                  className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors disabled:opacity-50 text-center"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                >
                  × Reject
                </button>
              </div>
            ))
          )}
        </div>

        {/* Featured companies */}
        <div className="rounded-[6px] border border-line overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-soft" style={{ padding: '12px 14px' }}>
            <h3 className="font-serif font-semibold text-ink" style={{ fontSize: 14 }}>Homepage · featured companies</h3>
            <Link to={ROUTES.ADMIN_FEATURED}>
              <button className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors" style={{ padding: '4px 10px', fontSize: 11 }}>
                + Add slot
              </button>
            </Link>
          </div>
          <div className="flex flex-col" style={{ padding: 14, gap: 8 }}>
            {featuredList.length === 0 ? (
              <div className="text-ink-3 text-center" style={{ padding: '20px 0', fontSize: 13 }}>
                No featured companies yet.{' '}
                <Link to={ROUTES.ADMIN_FEATURED} className="text-ls-accent underline underline-offset-2">
                  Add one →
                </Link>
              </div>
            ) : (
              featuredList.map((co, i) => (
                <div key={co.id} className="rounded-[4px] border border-line flex items-center" style={{ padding: '8px 10px', gap: 10 }}>
                  <span className="font-mono text-ink-3" style={{ fontSize: 11, width: 14 }}>{i + 1}</span>
                  <div
                    className="rounded-[4px] bg-bg-tint border border-line flex items-center justify-center font-mono font-semibold text-ink-2 flex-shrink-0"
                    style={{ width: 24, height: 24, fontSize: 10 }}
                  >
                    {co.name[0]}
                  </div>
                  <span className="font-semibold text-ink flex-1" style={{ fontSize: 12 }}>{co.name}</span>
                  <span className="text-ink-3" style={{ fontSize: 10 }}>≡ drag</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent admin actions */}
      <div>
        <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>
          Recent admin actions
        </div>
        <div className="rounded-[6px] border border-line overflow-hidden">
          {recentActions.length === 0 ? (
            <div className="text-ink-3 text-center" style={{ padding: '24px 0', fontSize: 13 }}>
              No admin actions recorded yet.
            </div>
          ) : (
            recentActions.slice(0, 6).map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center"
                style={{ padding: '8px 14px', borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : undefined, fontSize: 12 }}
              >
                <span className="flex-1 text-ink">{entry.action}</span>
                <span className="text-ink-3">{entry.performedBy} · {formatDateShort(entry.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
