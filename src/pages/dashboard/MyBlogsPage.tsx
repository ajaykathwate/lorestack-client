import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Pencil, ExternalLink, Archive, Trash2, RotateCcw,
  Send, Search, Clock, CalendarDays, Eye, FileText,
} from 'lucide-react'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useArchiveBlog, useDeleteBlog, useUnarchiveBlog, usePublishBlog } from '@/api/hooks/useBlogMutations'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'
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
  published:      { label: 'Published',  bg: '#e8f5e9', color: '#2e7d32' },
  draft:          { label: 'Draft',      bg: 'var(--ls-bg-soft)', color: 'var(--ls-ink-3)' },
  scheduled:      { label: 'Scheduled',  bg: '#fff8e1', color: '#f57f17' },
  archived:       { label: 'Archived',   bg: '#fff3e0', color: '#e65100' },
  publish_failed: { label: 'Failed',     bg: '#ffebee', color: '#c62828' },
}

export function MyBlogsPage() {
  const { data: blogs, isLoading } = useMyBlogs()
  const { mutate: archiveBlog } = useArchiveBlog()
  const { mutate: deleteBlog } = useDeleteBlog()
  const { mutate: unarchiveBlog } = useUnarchiveBlog()
  const { mutate: publishBlog } = usePublishBlog()

  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')

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
      onError: () => toast.error('Failed to archive.'),
    })
  }

  function handleDelete(slug: string, title: string) {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return
    deleteBlog(slug, {
      onSuccess: () => toast.success('Blog deleted.'),
      onError: () => toast.error('Failed to delete.'),
    })
  }

  function handleUnarchive(slug: string) {
    unarchiveBlog(slug, {
      onSuccess: () => toast.success('Blog restored to drafts.'),
      onError: () => toast.error('Failed to restore.'),
    })
  }

  function handlePublish(slug: string) {
    publishBlog(slug, {
      onSuccess: () => toast.success('Blog published!'),
      onError: () => toast.error('Failed to publish.'),
    })
  }

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex justify-between items-baseline" style={{ marginBottom: 20 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            My Blogs
            <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}> · {countByStatus.all ?? 0}</span>
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

      {/* Status tabs + search + sort in one row */}
      <div className="flex items-center border-b border-line" style={{ marginBottom: 18 }}>
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

        {/* Search + sort — pinned to the right */}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-[10px] border border-line bg-bg-tint animate-pulse" style={{ height: 190 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[10px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 56 }}>
          <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center text-ink-3" style={{ width: 48, height: 48, marginBottom: 14 }}>
            <FileText size={20} />
          </div>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 17 }}>
            {search ? 'No blogs match your search' : 'No blogs here yet'}
          </h3>
          <p className="text-ink-2" style={{ margin: '6px 0 18px', fontSize: 13 }}>
            {search ? 'Try a different search term.' : 'Start writing to see your blogs here.'}
          </p>
          {!search && (
            <Link
              to={ROUTES.EDITOR_NEW}
              className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              + Write blog
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onUnarchive={handleUnarchive}
              onPublish={handlePublish}
            />
          ))}
        </div>
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
}: {
  blog: BlogSummary
  onArchive: (slug: string, title: string) => void
  onDelete: (slug: string, title: string) => void
  onUnarchive: (slug: string) => void
  onPublish: (slug: string) => void
}) {
  const pill = STATUS_PILL[blog.status] ?? STATUS_PILL.draft

  const dateLabel = (() => {
    if (blog.status === 'published' && blog.publishedAt) return `Published ${formatDateShort(blog.publishedAt)}`
    if (blog.status === 'scheduled' && blog.scheduledAt) return `Scheduled for ${formatDateShort(blog.scheduledAt)}`
    if (blog.status === 'archived') return `Archived · created ${formatDateShort(blog.createdAt)}`
    return `Updated ${formatDateShort(blog.updatedAt)}`
  })()

  const dateIcon = blog.status === 'published' || blog.status === 'scheduled'
    ? <CalendarDays size={12} className="text-ink-3 flex-shrink-0" />
    : <Clock size={12} className="text-ink-3 flex-shrink-0" />

  return (
    <div
      className="flex flex-col rounded-[10px] border border-line bg-bg transition-shadow"
      style={{ overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
    >
      {/* Card top: cover strip or status + type row */}
      <div style={{ padding: '16px 18px 0' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          {/* Status pill */}
          <span
            className="font-mono font-semibold rounded-full"
            style={{ fontSize: 10, padding: '3px 10px', background: pill.bg, color: pill.color, letterSpacing: '0.4px' }}
          >
            {pill.label}
          </span>
          {/* Article type */}
          <span className="text-ink-3 font-mono" style={{ fontSize: 10, letterSpacing: '0.2px' }}>
            {articleTypeLabel(blog.articleType)}
          </span>
        </div>

        {/* Title */}
        <Link
          to={buildRoute.editor(blog.slug)}
          className="font-serif font-bold text-ink hover:text-ls-accent transition-colors"
          style={{ fontSize: 15, lineHeight: 1.3, display: 'block', marginBottom: 10 }}
        >
          {blog.title || <span className="text-ink-3 italic">Untitled</span>}
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-ink-3 line-clamp-2" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
            {blog.summary}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-line-soft" style={{ margin: '0 0 0 0' }} />

      {/* Meta row */}
      <div className="flex items-center" style={{ padding: '10px 18px', gap: 6 }}>
        {dateIcon}
        <span className="text-ink-3" style={{ fontSize: 12 }}>{dateLabel}</span>
        {blog.status === 'published' && blog.viewsCount > 0 && (
          <>
            <span className="text-line-strong" style={{ fontSize: 10 }}>·</span>
            <Eye size={12} className="text-ink-3" />
            <span className="text-ink-3" style={{ fontSize: 12 }}>{blog.viewsCount.toLocaleString()} views</span>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-line" />

      {/* Action buttons */}
      <div className="flex items-center" style={{ padding: '12px 16px', gap: 8 }}>
        {/* Primary: Edit */}
        <Link
          to={buildRoute.editor(blog.slug)}
          className="flex items-center rounded-[6px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
          style={{ gap: 6, padding: '7px 13px', fontSize: 13, fontWeight: 500, textDecoration: 'none', flex: 1, justifyContent: 'center' }}
        >
          <Pencil size={13} />
          Edit
        </Link>

        {/* Status-specific primary action */}
        {blog.status === 'published' && (
          <a
            href={buildRoute.blog(blog.slug)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center rounded-[6px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
            style={{ gap: 6, padding: '7px 13px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', textDecoration: 'none' }}
          >
            <ExternalLink size={13} />
            View Live
          </a>
        )}

        {blog.status === 'draft' && (
          <button
            onClick={() => onPublish(blog.slug)}
            className="flex items-center rounded-[6px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
            style={{ gap: 6, padding: '7px 13px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', cursor: 'pointer', background: 'none' }}
          >
            <Send size={13} />
            Publish
          </button>
        )}

        {blog.status === 'archived' && (
          <button
            onClick={() => onUnarchive(blog.slug)}
            className="flex items-center rounded-[6px] border border-line text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
            style={{ gap: 6, padding: '7px 13px', fontSize: 13, fontWeight: 500, flex: 1, justifyContent: 'center', cursor: 'pointer', background: 'none' }}
          >
            <RotateCcw size={13} />
            Restore
          </button>
        )}

        {/* Destructive / secondary action — right-aligned */}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          {(blog.status === 'published' || blog.status === 'scheduled') && (
            <button
              onClick={() => onArchive(blog.slug, blog.title)}
              className="flex items-center rounded-[6px] border border-line text-ink-3 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              style={{ gap: 5, padding: '7px 11px', fontSize: 13, cursor: 'pointer', background: 'none' }}
              title="Archive"
            >
              <Archive size={13} />
              Archive
            </button>
          )}

          {blog.status === 'draft' && (
            <button
              onClick={() => onDelete(blog.slug, blog.title)}
              className="flex items-center rounded-[6px] border border-line text-ink-3 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
              style={{ gap: 5, padding: '7px 11px', fontSize: 13, cursor: 'pointer', background: 'none' }}
              title="Delete draft"
            >
              <Trash2 size={13} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
