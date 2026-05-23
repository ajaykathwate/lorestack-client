import { Link, useNavigate } from 'react-router-dom'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate } from '@/lib/utils'

function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return 'publishing soon'
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  if (days > 0) return `in ${days}d ${hours}h`
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  if (hours > 0) return `in ${hours}h ${mins}m`
  return `in ${mins}m`
}

export function ScheduledPage() {
  const navigate = useNavigate()
  const { data: blogs, isLoading } = useMyBlogs()
  const scheduled = (blogs ?? []).filter((b) => b.status === 'scheduled')

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            Scheduled{' '}
            <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}>· {scheduled.length}</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 200 }} />
          ))}
        </div>
      ) : scheduled.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 14 }}>No scheduled posts</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>
            Open a draft in the editor and click Publish ▾ → Schedule.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {scheduled.map((blog) => (
            <div
              key={blog.id}
              className="rounded-[6px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(buildRoute.editor(blog.slug))}
            >
              {blog.coverImageUrl ? (
                <img
                  src={blog.coverImageUrl}
                  alt=""
                  style={{ width: '100%', height: 92, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div className="bg-bg-tint" style={{ height: 92 }} />
              )}
              <div className="flex flex-col flex-1" style={{ padding: '10px 12px', gap: 6 }}>
                <div className="flex items-center" style={{ gap: 6, flexWrap: 'wrap' }}>
                  <span className="font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px', background: '#fefce8', border: '1px solid #fef08a', color: '#854d0e' }}>
                    scheduled
                  </span>
                  <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px' }}>
                    {articleTypeLabel(blog.articleType)}
                  </span>
                </div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, lineHeight: 1.25 }}>
                  {blog.title || <em className="text-ink-3">Untitled</em>}
                </div>
                {blog.scheduledAt && (
                  <div className="font-mono text-ink-3" style={{ fontSize: 10 }}>
                    ⏱ {formatDate(blog.scheduledAt)} · {timeUntil(blog.scheduledAt)}
                  </div>
                )}
                <div className="flex items-center text-ink-3 mt-auto" style={{ fontSize: 11, gap: 6 }}>
                  <span className="flex-1" />
                  <Link
                    to={buildRoute.editor(blog.slug)}
                    className="text-ink-2 hover:text-ink transition-colors"
                    style={{ fontSize: 12 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit / Reschedule
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {scheduled.length > 0 && (
        <p className="text-ink-3" style={{ fontSize: 11, marginTop: 12 }}>
          To cancel a scheduled post, open it in the editor and republish as a draft.
        </p>
      )}
    </div>
  )
}
