import { useState, useMemo } from 'react'

function apiErr(err: unknown, fallback: string): string {
  return (err as any)?.response?.data?.message ?? fallback
}
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Pencil, ExternalLink, Archive, Trash2, RotateCcw,
  Send, Search, Clock, CalendarDays, Eye, FileText, CalendarClock,
} from 'lucide-react'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useArchiveBlog, useDeleteBlog, useUnarchiveBlog, usePublishBlog, useScheduleBlog } from '@/api/hooks/useBlogMutations'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'
import { ScheduleModal } from '@/shared/components/ScheduleModal'
import type { BlogStatus, BlogSummary } from '@/types/api'

type StatusTab = 'all' | BlogStatus
type SortKey = 'updatedAt' | 'createdAt'

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft',     label: 'Drafts' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'archived',  label: 'Archived' },
]

const STATUS_PILL: Record<BlogStatus, { label: string; bg: string; color: string }> = {
  published:      { label: 'Published',  bg: '#16a34a', color: '#fff' },
  draft:          { label: 'Draft',      bg: '#d97706', color: '#fff' },
  scheduled:      { label: 'Scheduled',  bg: '#2563eb', color: '#fff' },
  archived:       { label: 'Archived',   bg: '#6b7280', color: '#fff' },
  publish_failed: { label: 'Failed',     bg: '#dc2626', color: '#fff' },
}

function timeUntil(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now()
  if (diff <= 0) return 'any moment now'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) return `in ${days}d ${hours}h`
  if (hours > 0) return `in ${hours}h ${mins}m`
  return `in ${mins}m`
}

function formatScheduledDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' at '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDateWithTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    + ', '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function MyBlogsPage() {
  const { data: blogs, isLoading } = useMyBlogs()
  const { mutate: archiveBlog } = useArchiveBlog()
  const { mutate: deleteBlog } = useDeleteBlog()
  const { mutate: unarchiveBlog } = useUnarchiveBlog()
  const { mutate: publishBlog } = usePublishBlog()
  const { mutate: scheduleBlog, isPending: scheduling } = useScheduleBlog()

  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [scheduleSlug, setScheduleSlug] = useState<string | null>(null)

  const countByStatus = useMemo(() => {
    const counts: Partial<Record<StatusTab, number>> = { all: 0 }
    for (const b of blogs ?? []) {
      counts.all = (counts.all ?? 0) + 1
      counts[b.status] = (counts[b.status] ?? 0) + 1
    }
    return counts
  }, [blogs])

  const filtered = useMemo(() => {
    let items = blogs ?? []
    if (activeTab !== 'all') items = items.filter((b) => b.status === activeTab)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter((b) => b.title.toLowerCase().includes(q))
    }
    return [...items].sort((a, b) =>
      new Date(b[sortKey]).getTime() - new Date(a[sortKey]).getTime()
    )
  }, [blogs, activeTab, search, sortKey])

  function handleArchive(slug: string, title: string) {
    if (!confirm(`Archive "${title}"? It will be hidden from public pages.`)) return
    archiveBlog(slug, {
      onSuccess: () => toast.success('Blog archived.'),
      onError: (err) => toast.error(apiErr(err, 'Failed to archive.')),
    })
  }

  function handleDelete(slug: string, title: string) {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return
    deleteBlog(slug, {
      onSuccess: () => toast.success('Blog deleted.'),
      onError: (err) => toast.error(apiErr(err, 'Failed to delete.')),
    })
  }

  function handleUnarchive(slug: string) {
    unarchiveBlog(slug, {
      onSuccess: () => toast.success('Blog restored to drafts.'),
      onError: (err) => toast.error(apiErr(err, 'Failed to restore.')),
    })
  }

  function handlePublish(slug: string) {
    publishBlog(slug, {
      onSuccess: () => toast.success('Blog published!'),
      onError: (err) => toast.error(apiErr(err, 'Failed to publish.')),
    })
  }

  function handleScheduleSubmit(isoDateTime: string) {
    if (!scheduleSlug) return
    scheduleBlog({ slug: scheduleSlug, payload: { scheduledAt: isoDateTime } }, {
      onSuccess: () => { toast.success('Blog scheduled!'); setScheduleSlug(null) },
      onError: (err) => toast.error(apiErr(err, 'Failed to schedule.')),
    })
  }

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
          My Blogs
          <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}> · {countByStatus.all ?? 0}</span>
        </h1>
      </div>

      {/* Status tabs + search + sort */}
      <div className="flex items-center border-b border-line" style={{ marginBottom: 22 }}>
        {STATUS_TABS.map((tab) => {
          const count = countByStatus[tab.key] ?? 0
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '9px 14px', fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
                borderBottom: isActive ? '2px solid var(--ls-accent)' : '2px solid transparent',
                marginBottom: -1,
                background: 'none', border: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className="font-mono rounded-full"
                  style={{
                    fontSize: 10, padding: '1px 6px',
                    background: isActive ? 'var(--ls-ink)' : 'var(--ls-bg-tint)',
                    color: isActive ? 'var(--ls-bg)' : 'var(--ls-ink-3)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}

        <div className="flex items-center" style={{ gap: 8, marginLeft: 'auto', paddingBottom: 8 }}>
          <div
            className="flex items-center border border-line rounded-[6px]"
            style={{ height: 30, paddingLeft: 8, gap: 6, background: 'var(--ls-bg)' }}
          >
            <Search size={12} className="text-ink-3 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ width: 160, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, color: 'var(--ls-ink)', paddingRight: 8 }}
            />
          </div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="border border-line rounded-[6px] text-ink-2 bg-bg"
            style={{ height: 30, padding: '0 8px', fontSize: 12, outline: 'none', cursor: 'pointer' }}
          >
            <option value="updatedAt">Last updated</option>
            <option value="createdAt">Date created</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-[12px] border border-line bg-bg-tint animate-pulse" style={{ height: 200 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[12px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 64 }}>
          <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center text-ink-3" style={{ width: 52, height: 52, marginBottom: 16 }}>
            <FileText size={22} />
          </div>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>
            {search ? 'No blogs match your search' : 'No blogs here yet'}
          </h3>
          <p className="text-ink-2" style={{ margin: '8px 0 0', fontSize: 13 }}>
            {search ? 'Try a different search term.' : 'Start writing to see your blogs here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filtered.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onUnarchive={handleUnarchive}
              onPublish={handlePublish}
              onSchedule={(slug) => setScheduleSlug(slug)}
            />
          ))}
        </div>
      )}

      {scheduleSlug && (
        <ScheduleModal
          onClose={() => setScheduleSlug(null)}
          onSchedule={handleScheduleSubmit}
          isPending={scheduling}
        />
      )}
    </div>
  )
}

function BlogCard({
  blog,
  onArchive,
  onDelete,
  onUnarchive,
  onPublish,
  onSchedule,
}: {
  blog: BlogSummary
  onArchive: (slug: string, title: string) => void
  onDelete: (slug: string, title: string) => void
  onUnarchive: (slug: string) => void
  onPublish: (slug: string) => void
  onSchedule: (slug: string) => void
}) {
  const pill = STATUS_PILL[blog.status] ?? STATUS_PILL.draft

  const metaDate = (() => {
    if (blog.status === 'published' && blog.publishedAt) return formatDateShort(blog.publishedAt)
    if (blog.status === 'draft') return `Last saved: ${formatDateWithTime(blog.updatedAt)}`
    if (blog.status === 'archived') return formatDateShort(blog.createdAt)
    return formatDateShort(blog.updatedAt)
  })()

  const MetaIcon = blog.status === 'draft' ? Clock : CalendarDays

  return (
    <div
      className="flex flex-col rounded-[16px] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      {/* Card body */}
      <div style={{ padding: '20px 20px 0', flex: 1 }}>
        {/* Status pill + article type */}
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <span
            className="font-semibold rounded-full"
            style={{ fontSize: 11, padding: '3px 10px', background: pill.bg, color: pill.color }}
          >
            {pill.label}
          </span>
          <span className="flex items-center text-ink-3" style={{ gap: 5, fontSize: 12 }}>
            <FileText size={12} />
            {articleTypeLabel(blog.articleType)}
          </span>
        </div>

        {/* Title */}
        <Link
          to={buildRoute.editor(blog.slug)}
          className="font-serif font-bold text-ink hover:text-ls-accent transition-colors"
          style={{ fontSize: 17, lineHeight: 1.3, display: 'block', marginBottom: 8 }}
        >
          {blog.title || <span className="text-ink-3 italic">Untitled Draft</span>}
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-ink-3 line-clamp-2" style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 4 }}>
            {blog.summary}
          </p>
        )}

        {/* Scheduled info block */}
        {blog.status === 'scheduled' && blog.scheduledAt && (
          <div
            className="rounded-[8px] border border-line-soft bg-bg-soft"
            style={{ marginTop: 10, padding: '10px 12px' }}
          >
            <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
              <CalendarClock size={12} className="text-ink-3" />
              <span className="font-mono uppercase text-ink-3" style={{ fontSize: 9, letterSpacing: '1px' }}>Scheduled to publish</span>
            </div>
            <div className="font-semibold text-ink" style={{ fontSize: 13 }}>
              {formatScheduledDate(blog.scheduledAt)}
            </div>
            <div className="text-ink-3 font-mono" style={{ fontSize: 11, marginTop: 2 }}>
              {timeUntil(blog.scheduledAt)}
            </div>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center" style={{ padding: '12px 20px', gap: 6 }}>
        <MetaIcon size={12} className="text-ink-3 flex-shrink-0" />
        <span className="text-ink-3" style={{ fontSize: 12 }}>{metaDate}</span>
        {blog.status === 'published' && blog.viewsCount > 0 && (
          <>
            <span className="text-ink-3" style={{ margin: '0 2px', fontSize: 10 }}>·</span>
            <Eye size={12} className="text-ink-3" />
            <span className="text-ink-3" style={{ fontSize: 12 }}>{blog.viewsCount.toLocaleString()} Views</span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '12px 16px', gap: 8 }}
      >
        <Link
          to={buildRoute.editor(blog.slug)}
          className="flex items-center rounded-[8px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
          style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none', flex: 1, justifyContent: 'center' }}
        >
          <Pencil size={13} />
          Edit
        </Link>

        {blog.status === 'published' && (
          <a
            href={buildRoute.blog(blog.slug)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center rounded-[8px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
            style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', textDecoration: 'none' }}
          >
            <ExternalLink size={13} />
            View
          </a>
        )}

        {blog.status === 'draft' && (
          <>
            <button
              onClick={() => onPublish(blog.slug)}
              className="flex items-center rounded-[8px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
              style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', cursor: 'pointer', background: 'none' }}
            >
              <Send size={13} />
              Publish
            </button>
            <button
              onClick={() => onSchedule(blog.slug)}
              className="flex items-center rounded-[8px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
              style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', cursor: 'pointer', background: 'none' }}
            >
              <CalendarClock size={13} />
              Schedule
            </button>
          </>
        )}

        {blog.status === 'archived' && (
          <button
            onClick={() => onUnarchive(blog.slug)}
            className="flex items-center rounded-[8px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
            style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', cursor: 'pointer', background: 'none' }}
          >
            <RotateCcw size={13} />
            Restore
          </button>
        )}

        {blog.status === 'scheduled' && (
          <button
            onClick={() => onSchedule(blog.slug)}
            className="flex items-center rounded-[8px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
            style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', cursor: 'pointer', background: 'none' }}
          >
            <CalendarClock size={13} />
            Reschedule
          </button>
        )}

        {(blog.status === 'published' || blog.status === 'scheduled') && (
          <button
            onClick={() => onArchive(blog.slug, blog.title)}
            className="flex items-center rounded-[8px] border border-line text-ink-3 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            style={{ padding: '7px 10px', cursor: 'pointer', background: 'none', flexShrink: 0 }}
            title="Archive"
          >
            <Archive size={13} />
          </button>
        )}

        {(blog.status === 'draft' || blog.status === 'archived') && (
          <button
            onClick={() => onDelete(blog.slug, blog.title)}
            className="flex items-center rounded-[8px] border border-line text-ink-3 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            style={{ padding: '7px 10px', cursor: 'pointer', background: 'none', flexShrink: 0 }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
