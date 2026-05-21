import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { useArchiveBlog, useDeleteBlog } from '@/api/hooks/useBlogMutations'
import { useAuthStore } from '@/store/authStore'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'

export function DashboardPage() {
  const { authorProfile } = useAuthStore()
  const { data: blogs, isLoading } = useMyBlogs()
  const { data: companies } = useMyCompanies()
  const { mutate: archiveBlog } = useArchiveBlog()
  const { mutate: deleteBlog } = useDeleteBlog()

  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const allBlogs = blogs ?? []

  // Map company id → name
  const companyMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of companies ?? []) map[c.id] = c.name
    return map
  }, [companies])

  // Build company filter chips from actual blog data
  const companyChips = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {}
    for (const b of allBlogs) {
      if (b.companyId && companyMap[b.companyId]) {
        counts[b.companyId] = {
          name: companyMap[b.companyId],
          count: (counts[b.companyId]?.count ?? 0) + 1,
        }
      }
    }
    return Object.entries(counts).map(([id, { name, count }]) => ({ id, name, count }))
  }, [allBlogs, companyMap])

  const personalCount = allBlogs.filter((b) => !b.companyId).length

  const filtered = useMemo(() => {
    if (selectedCompany === 'all') return allBlogs
    if (selectedCompany === 'personal') return allBlogs.filter((b) => !b.companyId)
    return allBlogs.filter((b) => b.companyId === selectedCompany)
  }, [allBlogs, selectedCompany])

  const published = allBlogs.filter((b) => b.status === 'published')
  const drafts = allBlogs.filter((b) => b.status === 'draft')
  const scheduled = allBlogs.filter((b) => b.status === 'scheduled')

  const displayName = authorProfile?.displayName ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  function handleArchive(slug: string, title: string) {
    if (!confirm(`Archive "${title}"? It will be hidden from public pages.`)) return
    archiveBlog(slug, {
      onSuccess: () => toast.success('Blog archived.'),
      onError: () => toast.error('Failed to archive.'),
    })
  }

  function handleDelete(slug: string) {
    if (!confirm('Delete this draft permanently? This cannot be undone.')) return
    deleteBlog(slug, {
      onSuccess: () => toast.success('Draft deleted.'),
      onError: () => toast.error('Failed to delete.'),
    })
  }

  const STATS = [
    { label: 'Published',   value: String(published.length),  sub: published.length > 0 ? `+${Math.min(published.length, 2)} this month` : 'none yet' },
    { label: 'Total reads', value: '—',                        sub: 'analytics coming soon' },
    { label: 'Drafts',      value: String(drafts.length),     sub: drafts.length > 0 ? 'in progress' : 'none' },
    { label: 'Scheduled',   value: String(scheduled.length),  sub: scheduled.length > 0 ? 'queued' : 'none' },
  ]

  const statusStyle = (status: string) => {
    if (status === 'published') return { background: 'var(--ls-accent-soft, #f6e5dc)', color: 'var(--ls-accent-ink, #8c3f25)', borderColor: 'transparent' }
    if (status === 'scheduled') return { background: '#fefce8', color: '#854d0e', borderColor: 'transparent' }
    if (status === 'archived')  return { background: 'var(--ls-bg-soft)', color: 'var(--ls-ink-3)', borderColor: 'var(--ls-line)' }
    return { background: 'var(--ls-bg-soft)', color: 'var(--ls-ink-3)', borderColor: 'var(--ls-line)' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
            Dashboard
          </div>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            {greeting}, {displayName}.
          </h1>
        </div>
        <Link
          to={ROUTES.EDITOR_NEW}
          className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          + Write blog
        </Link>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        {STATS.map(({ label, value, sub }) => (
          <div key={label} className="rounded-[6px] border border-line bg-bg" style={{ padding: 12 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--ls-ink-3)' }}>
              {label}
            </div>
            <div className="font-serif font-semibold text-ink" style={{ fontSize: 22, marginTop: 4 }}>{value}</div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Company filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* All chip */}
        <button
          onClick={() => setSelectedCompany('all')}
          style={{
            fontSize: 11, padding: '4px 12px', borderRadius: 99, border: '1px solid',
            cursor: 'pointer', transition: 'all 0.12s',
            background: selectedCompany === 'all' ? 'var(--ls-ink)' : 'var(--ls-bg)',
            color: selectedCompany === 'all' ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
            borderColor: selectedCompany === 'all' ? 'var(--ls-ink)' : 'var(--ls-line)',
          }}
        >
          All · {allBlogs.length}
        </button>

        {/* Company chips */}
        {companyChips.map(({ id, name, count }) => (
          <button
            key={id}
            onClick={() => setSelectedCompany(id)}
            style={{
              fontSize: 11, padding: '4px 12px', borderRadius: 99, border: '1px solid',
              cursor: 'pointer', transition: 'all 0.12s',
              background: selectedCompany === id ? 'var(--ls-ink)' : 'var(--ls-bg)',
              color: selectedCompany === id ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
              borderColor: selectedCompany === id ? 'var(--ls-ink)' : 'var(--ls-line)',
            }}
          >
            {name} · {count}
          </button>
        ))}

        {/* Personal chip (only when there are personal blogs and user has companies) */}
        {personalCount > 0 && companyChips.length > 0 && (
          <button
            onClick={() => setSelectedCompany('personal')}
            style={{
              fontSize: 11, padding: '4px 12px', borderRadius: 99, border: '1px solid',
              cursor: 'pointer', transition: 'all 0.12s',
              background: selectedCompany === 'personal' ? 'var(--ls-ink)' : 'var(--ls-bg)',
              color: selectedCompany === 'personal' ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
              borderColor: selectedCompany === 'personal' ? 'var(--ls-ink)' : 'var(--ls-line)',
            }}
          >
            Personal · {personalCount}
          </button>
        )}

        <div style={{ flex: 1 }} />
        <span className="border border-line text-ink-3 rounded-[4px]" style={{ padding: '4px 8px', fontSize: 11 }}>
          Sort: Newest ▾
        </span>
      </div>

      {/* Blog list */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 56 }} />
          ))}
        </div>
      ) : allBlogs.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 20, marginTop: 14 }}>Your library is empty</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>
            Write your first blog and share your engineering story.
          </p>
          <Link
            to={ROUTES.EDITOR_NEW}
            className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            + Write your first blog
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
          <p className="text-ink-3" style={{ fontSize: 13 }}>No blogs in this view.</p>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {filtered.map((blog, i) => {
            const companyName = blog.companyId ? (companyMap[blog.companyId] ?? '—') : 'Personal'
            const isMenuOpen = openMenu === blog.id

            return (
              <div
                key={blog.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '130px 1fr 120px 110px 110px 30px',
                  padding: '14px 14px',
                  borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                  gap: 14, alignItems: 'center',
                }}
              >
                {/* Article type badge */}
                <span
                  style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 3,
                    border: '1px solid', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    fontFamily: '"JetBrains Mono", monospace', textAlign: 'center',
                    ...statusStyle(blog.status),
                    // Override with type label style for the badge
                    background: 'var(--ls-bg-soft)', color: 'var(--ls-ink-2)', borderColor: 'var(--ls-line)',
                  }}
                >
                  {articleTypeLabel(blog.articleType)}
                </span>

                {/* Title + slug */}
                <div>
                  <div className="font-serif font-semibold text-ink truncate" style={{ fontSize: 14 }}>
                    {blog.title || <em style={{ color: 'var(--ls-ink-3)' }}>Untitled</em>}
                  </div>
                  <div className="text-ink-3 truncate" style={{ fontSize: 11, marginTop: 2, fontFamily: '"JetBrains Mono", monospace' }}>
                    {companyName} · /blog/{blog.slug}
                  </div>
                </div>

                {/* Status */}
                <span
                  style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 3, border: '1px solid',
                    fontFamily: '"JetBrains Mono", monospace', textAlign: 'center',
                    width: 'fit-content', textTransform: 'capitalize',
                    ...statusStyle(blog.status),
                  }}
                >
                  {blog.status}
                </span>

                {/* Date */}
                <span className="text-ink-2" style={{ fontSize: 12 }}>
                  {formatDateShort(blog.publishedAt ?? blog.scheduledAt ?? blog.updatedAt)}
                </span>

                {/* Reads placeholder */}
                <span className="text-ink-3" style={{ fontSize: 12 }}>—</span>

                {/* ··· menu */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenMenu(isMenuOpen ? null : blog.id)}
                    className="text-ink-3 hover:text-ink transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                  >
                    ···
                  </button>
                  {isMenuOpen && (
                    <>
                      {/* Click-away overlay */}
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                        onClick={() => setOpenMenu(null)}
                      />
                      <div style={{
                        position: 'absolute', right: 0, top: '100%', zIndex: 20,
                        background: 'var(--ls-bg)', border: '1px solid var(--ls-line)',
                        borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        minWidth: 140, padding: '4px 0',
                      }}>
                        <Link
                          to={buildRoute.editor(blog.slug)}
                          onClick={() => setOpenMenu(null)}
                          style={{ display: 'block', padding: '7px 14px', fontSize: 12, color: 'var(--ls-ink-2)', textDecoration: 'none' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ls-bg-tint)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          ✎ Edit
                        </Link>
                        {blog.status === 'published' && (
                          <a
                            href={buildRoute.blog(blog.slug)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setOpenMenu(null)}
                            style={{ display: 'block', padding: '7px 14px', fontSize: 12, color: 'var(--ls-ink-2)', textDecoration: 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ls-bg-tint)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            ↗ View live
                          </a>
                        )}
                        {(blog.status === 'published' || blog.status === 'scheduled') && (
                          <button
                            onClick={() => { setOpenMenu(null); handleArchive(blog.slug, blog.title) }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px', fontSize: 12, color: 'var(--ls-ink-2)', background: 'none', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ls-bg-tint)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            ⌫ Archive
                          </button>
                        )}
                        {blog.status === 'draft' && (
                          <button
                            onClick={() => { setOpenMenu(null); handleDelete(blog.slug) }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px', fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ls-bg-tint)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            × Delete draft
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
