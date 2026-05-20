import { Link } from 'react-router-dom'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useAuthStore } from '@/store/authStore'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'

export function DashboardPage() {
  const { authorProfile } = useAuthStore()
  const { data: blogs, isLoading } = useMyBlogs()

  const allBlogs = blogs ?? []
  const published = allBlogs.filter((b) => b.status === 'published')
  const drafts = allBlogs.filter((b) => b.status === 'draft')
  const scheduled = allBlogs.filter((b) => b.status === 'scheduled')

  const STATS = [
    { label: 'Published', value: published.length.toString(), sub: '+' + Math.min(published.length, 2) + ' this month' },
    { label: 'Total reads', value: '—', sub: 'last 30d' },
    { label: 'Drafts', value: drafts.length.toString(), sub: drafts.length > 0 ? 'last edit 2d ago' : 'none' },
    { label: 'Scheduled', value: scheduled.length.toString(), sub: scheduled.length > 0 ? 'next: TBD' : 'none' },
  ]

  const displayName = authorProfile?.displayName ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 14 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Dashboard</span>
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
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>{label}</div>
            <div className="font-serif font-semibold text-ink" style={{ fontSize: 22, marginTop: 4 }}>{value}</div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
        <button
          className="bg-ink text-bg rounded-full font-sans"
          style={{ fontSize: 11, padding: '4px 12px' }}
        >
          All · {allBlogs.length}
        </button>
        <div className="flex-1" />
        <span className="border border-line text-ink-3 rounded-[4px]" style={{ padding: '4px 8px', fontSize: 11 }}>
          Sort: Newest ▾
        </span>
      </div>

      {/* Blog list */}
      {isLoading ? (
        <div className="flex flex-col" style={{ gap: 0 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 56, marginBottom: 1 }} />
          ))}
        </div>
      ) : allBlogs.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 20, marginTop: 14 }}>Your library is empty</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>Write your first blog and share your engineering story.</p>
          <Link
            to={ROUTES.EDITOR_NEW}
            className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            + Write your first blog
          </Link>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {allBlogs.map((blog, i) => (
            <div
              key={blog.id}
              className="flex items-center"
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 120px 110px 30px',
                padding: '14px 14px',
                borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                gap: 14,
                alignItems: 'center',
              }}
            >
              <span
                className={`border rounded-[3px] font-mono text-center ${
                  blog.status === 'published'
                    ? 'bg-ls-accent/10 border-ls-accent/30 text-ls-accent'
                    : blog.status === 'scheduled'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                    : 'border-line text-ink-3'
                }`}
                style={{ fontSize: 10, padding: '2px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {articleTypeLabel(blog.articleType)}
              </span>
              <div>
                <div className="font-serif font-semibold text-ink truncate" style={{ fontSize: 14 }}>{blog.title}</div>
                <div className="text-ink-3 truncate font-mono" style={{ fontSize: 11, marginTop: 2 }}>
                  /blog/{blog.slug}
                </div>
              </div>
              <span
                className="capitalize text-ink-2"
                style={{ fontSize: 12 }}
              >
                {blog.status}
              </span>
              <span className="text-ink-2" style={{ fontSize: 12 }}>
                {formatDateShort(blog.publishedAt ?? blog.scheduledAt ?? blog.updatedAt)}
              </span>
              <div className="flex" style={{ gap: 6 }}>
                <Link
                  to={buildRoute.editor(blog.slug)}
                  className="text-ink-3 hover:text-ink transition-colors"
                  style={{ fontSize: 14 }}
                  title="Edit"
                >
                  ✎
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
