import { useState } from 'react'
import { useAdminReports } from '@/api/hooks/useAdminQueries'
import { useResolveReport, useDismissReport } from '@/api/hooks/useAdminMutations'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { formatDateShort } from '@/lib/utils'

type ReportFilter = 'open' | 'all' | 'resolved' | 'dismissed'

export function AdminReportsPage() {
  const [filter, setFilter] = useState<ReportFilter>('open')
  const { data: reports, isLoading } = useAdminReports(filter === 'all' ? undefined : filter)
  const { mutate: resolve, isPending: resolving } = useResolveReport()
  const { mutate: dismiss, isPending: dismissing } = useDismissReport()

  const list = reports ?? []
  const openCount = (reports ?? []).filter((r) => r.status === 'open').length

  const FILTERS: { key: ReportFilter; label: string }[] = [
    { key: 'open',      label: `Open · ${openCount}` },
    { key: 'all',       label: 'All' },
    { key: 'resolved',  label: 'Resolved' },
    { key: 'dismissed', label: 'Dismissed' },
  ]

  const TARGET_TYPE_LABEL: Record<string, string> = {
    blog: 'Blog',
    user: 'User',
    company: 'Company',
  }

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Reports</h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
          User-submitted reports about content, accounts, and companies.
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

      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spinner size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 48 }}>
          <p className="text-ink-3" style={{ fontSize: 13 }}>
            {filter === 'open' ? 'No open reports. Platform is clean.' : 'No reports found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {/* Column headers */}
          <div
            className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line-soft"
            style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 110px 160px', padding: '8px 14px', gap: 10, fontSize: 10, letterSpacing: '0.5px' }}
          >
            <span>Target</span>
            <span>Content</span>
            <span>Reason</span>
            <span>Reports</span>
            <span>Date</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {list.map((report, i) => (
            <div
              key={report.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 100px 100px 110px 160px',
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
                  background: 'var(--ls-bg-soft)',
                  color: 'var(--ls-ink-2)',
                  border: '1px solid var(--ls-line)',
                }}
              >
                {TARGET_TYPE_LABEL[report.targetType] ?? report.targetType}
              </span>

              <div className="font-serif font-semibold text-ink truncate" style={{ fontSize: 13 }}>
                {report.targetTitle}
              </div>

              <span className="text-ink-3" style={{ fontSize: 11 }}>{report.reason}</span>

              <span className="font-mono text-ink-2">
                {report.reportCount} {report.reportCount === 1 ? 'report' : 'reports'}
              </span>

              <span className="text-ink-3">{formatDateShort(report.createdAt)}</span>

              <div className="flex justify-end" style={{ gap: 6 }}>
                {report.status === 'open' ? (
                  <>
                    <button
                      onClick={() => resolve(report.id)}
                      disabled={resolving}
                      className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors disabled:opacity-50"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => dismiss(report.id)}
                      disabled={dismissing}
                      className="border border-line text-ink-3 rounded-[3px] hover:bg-bg-tint transition-colors disabled:opacity-50"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <span
                    className="font-mono rounded-[3px]"
                    style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      background: report.status === 'resolved' ? '#dcfce7' : 'var(--ls-bg-tint)',
                      color: report.status === 'resolved' ? '#166534' : 'var(--ls-ink-3)',
                    }}
                  >
                    {report.status}
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
