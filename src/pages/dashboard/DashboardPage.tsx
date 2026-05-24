import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { toast } from 'sonner'
import {
  MoreHorizontal, Pencil, ExternalLink, Archive, Trash2,
  BookOpen, FileText, Clock, Send,
} from 'lucide-react'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useMyCompanies } from '@/api/hooks/useCompanyQueries'
import { useArchiveBlog, useDeleteBlog } from '@/api/hooks/useBlogMutations'
import { useAuthStore } from '@/store/authStore'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub: string
  Icon: React.ElementType
  accent?: boolean
  to?: string
}

function StatCard({ label, value, sub, Icon, accent, to }: StatCardProps) {
  const inner = (
    <div
      className={`rounded-[8px] border flex flex-col group transition-all ${accent ? 'bg-ink border-ink' : 'bg-bg border-line hover:border-line-strong'}`}
      style={{ padding: '16px 18px', gap: 10 }}
    >
      <div className="flex items-start justify-between">
        <span
          className={`font-mono uppercase ${accent ? 'text-bg/50' : 'text-ink-3'}`}
          style={{ fontSize: 10, letterSpacing: '1.2px' }}
        >
          {label}
        </span>
        <div
          className={`rounded-[6px] flex items-center justify-center ${accent ? 'bg-white/10' : 'bg-bg-soft border border-line'}`}
          style={{ width: 28, height: 28 }}
        >
          <Icon size={13} className={accent ? 'text-bg/70' : 'text-ink-3'} />
        </div>
      </div>
      <div>
        <div
          className={`font-serif font-bold ${accent ? 'text-bg' : 'text-ink'}`}
          style={{ fontSize: 28, lineHeight: 1 }}
        >
          {value}
        </div>
        <div
          className={`${accent ? 'text-bg/50' : 'text-ink-3'}`}
          style={{ fontSize: 11, marginTop: 5 }}
        >
          {sub}
        </div>
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}

export function DashboardPage() {
  const { authorProfile } = useAuthStore()
  const { data: blogs, isLoading } = useMyBlogs()
  const { data: companies } = useMyCompanies()
  const { mutate: archiveBlog } = useArchiveBlog()
  const { mutate: deleteBlog } = useDeleteBlog()

  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const allBlogs = blogs ?? []

  const companyMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of companies ?? []) map[c.id] = c.name
    return map
  }, [companies])

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

  const statusStyle = (status: string): React.CSSProperties => {
    if (status === 'published') return { background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)' }
    if (status === 'scheduled') return { background: '#fefce8', color: '#854d0e' }
    if (status === 'archived') return { background: 'var(--ls-bg-soft)', color: 'var(--ls-ink-3)' }
    return { background: 'var(--ls-bg-soft)', color: 'var(--ls-ink-3)' }
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>
            Dashboard
          </div>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            {greeting}, {displayName}.
          </h1>
          <p className="text-ink-3" style={{ fontSize: 13, marginTop: 2 }}>
            {allBlogs.length > 0
              ? `${published.length} published · ${drafts.length} drafts · ${scheduled.length} scheduled`
              : 'Your writing studio. Start your first article.'}
          </p>
        </div>

      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <StatCard
          label="Published"
          value={String(published.length)}
          sub={published.length > 0 ? `${Math.min(published.length, 2)} new this month` : 'None yet — publish your first'}
          Icon={BookOpen}
          accent
          to={ROUTES.MY_BLOGS}
        />
        <StatCard
          label="Drafts"
          value={String(drafts.length)}
          sub={drafts.length > 0 ? 'In progress' : 'Nothing in progress'}
          Icon={FileText}
          to={ROUTES.MY_BLOGS}
        />
        <StatCard
          label="Scheduled"
          value={String(scheduled.length)}
          sub={scheduled.length > 0 ? 'Queued to publish' : 'No scheduled posts'}
          Icon={Clock}
          to={ROUTES.MY_BLOGS}
        />
        <StatCard
          label="Total reads"
          value="—"
          sub="Analytics launching soon"
          Icon={Send}
        />
      </div>

      {/* ── Quick actions (only when no content) ── */}
      {allBlogs.length === 0 && !isLoading && (
        <div
          className="rounded-[8px] border border-line border-dashed flex flex-col items-center justify-center text-center"
          style={{ padding: '48px 24px' }}
        >
          <div
            className="rounded-full bg-bg-soft border border-line flex items-center justify-center"
            style={{ width: 48, height: 48, marginBottom: 14 }}
          >
            <PenLine size={18} className="text-ink-3" />
          </div>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>
            Your library is empty
          </h3>
          <p className="text-ink-2" style={{ margin: '6px 0 20px', fontSize: 13, maxWidth: 340 }}>
            Share your engineering story — an architecture deep-dive, a postmortem, a tutorial. Your audience is waiting.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={ROUTES.EXPLORE}
              className="flex items-center gap-2 border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              Browse articles
            </Link>
          </div>
        </div>
      )}

      {/* ── Articles table ── */}
      {allBlogs.length > 0 && (
        <div className="flex flex-col" style={{ gap: 10 }}>

          {/* Filter row */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCompany('all')}
              className="rounded-full border font-mono transition-colors"
              style={{
                fontSize: 11, padding: '4px 12px',
                background: selectedCompany === 'all' ? 'var(--ls-ink)' : 'var(--ls-bg)',
                color: selectedCompany === 'all' ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
                borderColor: selectedCompany === 'all' ? 'var(--ls-ink)' : 'var(--ls-line)',
              }}
            >
              All · {allBlogs.length}
            </button>

            {companyChips.map(({ id, name, count }) => (
              <button
                key={id}
                onClick={() => setSelectedCompany(id)}
                className="rounded-full border font-mono transition-colors"
                style={{
                  fontSize: 11, padding: '4px 12px',
                  background: selectedCompany === id ? 'var(--ls-ink)' : 'var(--ls-bg)',
                  color: selectedCompany === id ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
                  borderColor: selectedCompany === id ? 'var(--ls-ink)' : 'var(--ls-line)',
                }}
              >
                {name} · {count}
              </button>
            ))}

            {personalCount > 0 && companyChips.length > 0 && (
              <button
                onClick={() => setSelectedCompany('personal')}
                className="rounded-full border font-mono transition-colors"
                style={{
                  fontSize: 11, padding: '4px 12px',
                  background: selectedCompany === 'personal' ? 'var(--ls-ink)' : 'var(--ls-bg)',
                  color: selectedCompany === 'personal' ? 'var(--ls-bg)' : 'var(--ls-ink-2)',
                  borderColor: selectedCompany === 'personal' ? 'var(--ls-ink)' : 'var(--ls-line)',
                }}
              >
                Personal · {personalCount}
              </button>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-col" style={{ gap: 6 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 58 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 32 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No articles in this view.</p>
            </div>
          ) : (
            <div className="rounded-[8px] border border-line overflow-hidden bg-bg">
              {/* Column headers */}
              <div
                className="border-b border-line bg-bg-soft"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 100px 90px 30px',
                  padding: '8px 14px', gap: 14, alignItems: 'center',
                }}
              >
                {['Type', 'Title', 'Status', 'Date', ''].map((h) => (
                  <span
                    key={h}
                    className="font-mono uppercase text-ink-3"
                    style={{ fontSize: 9, letterSpacing: '1px' }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {filtered.map((blog, i) => {
                const companyName = blog.companyId ? (companyMap[blog.companyId] ?? '—') : 'Personal'
                const isMenuOpen = openMenu === blog.id

                return (
                  <div
                    key={blog.id}
                    className="hover:bg-bg-soft transition-colors"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr 100px 90px 30px',
                      padding: '13px 14px',
                      borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                      gap: 14, alignItems: 'center',
                    }}
                  >
                    {/* Type badge */}
                    <span
                      className="font-mono rounded-[3px] border text-center truncate"
                      style={{
                        fontSize: 10, padding: '2px 6px',
                        background: 'var(--ls-bg-soft)',
                        color: 'var(--ls-ink-2)',
                        borderColor: 'var(--ls-line)',
                      }}
                    >
                      {articleTypeLabel(blog.articleType)}
                    </span>

                    {/* Title + slug */}
                    <div className="min-w-0">
                      <Link
                        to={buildRoute.editor(blog.slug)}
                        className="font-serif font-semibold text-ink truncate block hover:text-ls-accent transition-colors"
                        style={{ fontSize: 14 }}
                      >
                        {blog.title || <em style={{ color: 'var(--ls-ink-3)', fontStyle: 'italic' }}>Untitled</em>}
                      </Link>
                      <div
                        className="text-ink-3 truncate font-mono"
                        style={{ fontSize: 10, marginTop: 2 }}
                      >
                        {companyName} · /blog/{blog.slug}
                      </div>
                    </div>

                    {/* Status pill */}
                    <span
                      className="rounded-full font-mono capitalize text-center"
                      style={{
                        fontSize: 10, padding: '3px 8px', width: 'fit-content',
                        ...statusStyle(blog.status),
                      }}
                    >
                      {blog.status}
                    </span>

                    {/* Date */}
                    <span className="text-ink-3 font-mono" style={{ fontSize: 11 }}>
                      {formatDateShort(blog.publishedAt ?? blog.scheduledAt ?? blog.updatedAt)}
                    </span>

                    {/* ··· menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenMenu(isMenuOpen ? null : blog.id)}
                        className="text-ink-3 hover:text-ink transition-colors rounded-[4px] hover:bg-bg-tint"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px 4px' }}
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div
                            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                            onClick={() => setOpenMenu(null)}
                          />
                          <div
                            className="rounded-[6px] border border-line bg-bg"
                            style={{
                              position: 'absolute', right: 0, top: '100%', zIndex: 20,
                              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                              minWidth: 148, padding: '4px 0', marginTop: 4,
                            }}
                          >
                            <Link
                              to={buildRoute.editor(blog.slug)}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                              style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
                            >
                              <Pencil size={11} />Edit
                            </Link>
                            {blog.status === 'published' && (
                              <a
                                href={buildRoute.blog(blog.slug)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpenMenu(null)}
                                className="flex items-center gap-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                                style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
                              >
                                <ExternalLink size={11} />View live
                              </a>
                            )}
                            {(blog.status === 'published' || blog.status === 'scheduled') && (
                              <button
                                onClick={() => { setOpenMenu(null); handleArchive(blog.slug, blog.title) }}
                                className="flex items-center gap-2 w-full text-left text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                                style={{ padding: '8px 14px', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                <Archive size={11} />Archive
                              </button>
                            )}
                            {blog.status === 'draft' && (
                              <button
                                onClick={() => { setOpenMenu(null); handleDelete(blog.slug) }}
                                className="flex items-center gap-2 w-full text-left hover:bg-bg-tint transition-colors"
                                style={{ padding: '8px 14px', fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                <Trash2 size={11} />Delete draft
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
      )}
    </div>
  )
}
