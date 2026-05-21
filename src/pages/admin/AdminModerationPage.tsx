import { useState } from 'react'
import { useAdminModerationQueue } from '@/api/hooks/useAdminQueries'
import { useApproveModerationItem, useRejectModerationItem } from '@/api/hooks/useAdminMutations'
import { Spinner } from '@/shared/components/feedback/Spinner'
import type { ModerationItemType } from '@/types/api/admin'

type FilterStatus = 'pending' | 'all' | 'approved' | 'rejected'

const TYPE_LABEL: Record<ModerationItemType, string> = {
  report: 'REPORT',
  new_tag: 'NEW TAG',
  user_flag: 'USER',
}

export function AdminModerationPage() {
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const { data: queue, isLoading } = useAdminModerationQueue()
  const { mutate: approve, isPending: approving } = useApproveModerationItem()
  const { mutate: reject, isPending: rejecting } = useRejectModerationItem()

  const items = (queue ?? []).filter((item) =>
    filter === 'all' ? true : item.status === filter,
  )

  const pendingCount = (queue ?? []).filter((i) => i.status === 'pending').length

  const FILTERS: { key: FilterStatus; label: string }[] = [
    { key: 'pending', label: `Pending · ${pendingCount}` },
    { key: 'all',     label: 'All' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Moderation queue</h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
          Reports, flagged tags, and users requiring admin review.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex" style={{ gap: 6 }}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="rounded-full border transition-colors font-sans"
            style={{
              padding: '4px 12px',
              fontSize: 12,
              background: filter === key ? 'var(--ls-ink)' : 'var(--ls-bg)',
              color: filter === key ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
              borderColor: filter === key ? 'var(--ls-ink)' : 'var(--ls-line)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spinner size="md" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 48 }}>
          <p className="text-ink-3" style={{ fontSize: 13 }}>
            {filter === 'pending' ? 'No items pending review.' : 'No items found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {/* Header row */}
          <div
            className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line-soft"
            style={{ display: 'grid', gridTemplateColumns: '90px 1fr 160px 90px 160px', padding: '8px 14px', gap: 10, fontSize: 10, letterSpacing: '0.5px' }}
          >
            <span>Type</span>
            <span>Item</span>
            <span>Reason</span>
            <span>Flag</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr 160px 90px 160px',
                padding: '12px 14px',
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
                {TYPE_LABEL[item.type]}
              </span>

              <div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 13 }}>{item.title}</div>
                {item.flag && (
                  <div className="text-ink-3" style={{ fontSize: 10, marginTop: 2 }}>flag: {item.flag}</div>
                )}
              </div>

              <span className="text-ink-3" style={{ fontSize: 11 }}>{item.reason}</span>

              <span
                className="border border-line text-ink-2 rounded-full text-center"
                style={{ fontSize: 10, padding: '2px 8px' }}
              >
                {item.flag ?? '—'}
              </span>

              <div className="flex justify-end" style={{ gap: 6 }}>
                {item.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => approve(item.id)}
                      disabled={approving}
                      className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors disabled:opacity-50"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => reject(item.id)}
                      disabled={rejecting}
                      className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors disabled:opacity-50"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      × Reject
                    </button>
                  </>
                ) : (
                  <span
                    className="font-mono rounded-[3px] text-center"
                    style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      background: item.status === 'approved' ? '#dcfce7' : '#fee2e2',
                      color: item.status === 'approved' ? '#166534' : '#991b1b',
                    }}
                  >
                    {item.status}
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
