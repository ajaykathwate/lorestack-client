import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useUnarchiveBlog } from '@/api/hooks/useBlogMutations'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate } from '@/lib/utils'

export function ScheduledPage() {
  const { data: blogs, isLoading } = useMyBlogs()
  const { mutate: unarchive } = useUnarchiveBlog()

  const scheduled = (blogs ?? []).filter((b) => b.status === 'scheduled')

  function handleUnschedule(slug: string) {
    unarchive(slug, {
      onSuccess: () => toast.success('Moved back to drafts.'),
      onError: () => toast.error('Failed to unschedule.'),
    })
  }

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            Scheduled <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}>· {scheduled.length}</span>
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

      {isLoading ? (
        <div className="flex flex-col" style={{ gap: 10 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 72 }} />
          ))}
        </div>
      ) : scheduled.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 14 }}>No scheduled posts</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>
            Schedule a draft to publish it automatically at a set time.
          </p>
          <Link
            to={ROUTES.DRAFTS}
            className="border border-line text-ink-2 font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            View drafts
          </Link>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {scheduled.map((blog, i) => (
            <div
              key={blog.id}
              style={{
                padding: '14px 16px',
                borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 14,
                alignItems: 'center',
              }}
            >
              <div>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                  <span className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px' }}>
                    {articleTypeLabel(blog.articleType)}
                  </span>
                  <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>
                    ⏱ Publishes {blog.scheduledAt ? formatDate(blog.scheduledAt) : '—'}
                  </span>
                </div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 15, lineHeight: 1.2 }}>
                  {blog.title}
                </div>
              </div>
              <div className="flex" style={{ gap: 8 }}>
                <Link
                  to={buildRoute.editor(blog.slug)}
                  className="border border-line text-ink-2 font-medium rounded-[4px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleUnschedule(blog.slug)}
                  className="text-ink-3 hover:text-red-500 transition-colors"
                  style={{ padding: '6px 8px', fontSize: 12 }}
                >
                  Unschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
