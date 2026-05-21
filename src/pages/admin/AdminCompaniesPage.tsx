import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminCompanies } from '@/api/hooks/useAdminQueries'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { initials, formatDateShort } from '@/lib/utils'
import { buildRoute } from '@/constants/routes'

export function AdminCompaniesPage() {
  const [search, setSearch] = useState('')
  const { data: companies, isLoading } = useAdminCompanies({ search: search || undefined })

  const list = companies ?? []

  return (
    <div className="flex flex-col" style={{ padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Companies</h1>
          <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
            {list.length} companies on the platform.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="⌕ search companies"
          className="border border-line rounded-[4px] text-ink bg-bg placeholder:text-ink-3 focus:outline-none focus:border-line-strong"
          style={{ padding: '6px 10px', fontSize: 12, minWidth: 220 }}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spinner size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 48 }}>
          <p className="text-ink-3" style={{ fontSize: 13 }}>
            {search ? `No companies matching "${search}".` : 'No companies found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {/* Column headers */}
          <div
            className="font-mono uppercase text-ink-3 bg-bg-soft border-b border-line-soft"
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 90px 110px 120px', padding: '8px 14px', gap: 10, fontSize: 10, letterSpacing: '0.5px' }}
          >
            <span />
            <span>Company</span>
            <span>Handle</span>
            <span>Members</span>
            <span>Blogs</span>
            <span>Created</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {list.map((co, i) => (
            <div
              key={co.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 100px 80px 90px 110px 120px',
                padding: '12px 14px',
                gap: 10,
                alignItems: 'center',
                borderTop: i > 0 ? '1px solid var(--ls-line-soft)' : undefined,
                fontSize: 12,
              }}
            >
              <div
                className="rounded-[4px] bg-bg-tint border border-line flex items-center justify-center font-mono font-semibold text-ink-2"
                style={{ width: 28, height: 28, fontSize: 10 }}
              >
                {initials(co.name)}
              </div>
              <div>
                <div className="font-semibold text-ink" style={{ fontSize: 13 }}>{co.name}</div>
                <div className="flex items-center" style={{ gap: 6, marginTop: 2 }}>
                  {!co.isPublic && (
                    <span
                      className="font-mono rounded-[3px]"
                      style={{ fontSize: 9, padding: '1px 5px', background: 'var(--ls-bg-tint)', color: 'var(--ls-ink-3)', border: '1px solid var(--ls-line)' }}
                    >
                      Private
                    </span>
                  )}
                </div>
              </div>
              <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>/{co.handle}</span>
              <span className="text-ink-2">{co.memberCount}</span>
              <span className="text-ink-2">{co.blogCount}</span>
              <span className="text-ink-3">{formatDateShort(co.createdAt)}</span>
              <div className="flex justify-end" style={{ gap: 6 }}>
                <Link
                  to={buildRoute.company(co.handle)}
                  target="_blank"
                  className="border border-line text-ink-2 rounded-[3px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '3px 8px', fontSize: 11 }}
                >
                  View ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
