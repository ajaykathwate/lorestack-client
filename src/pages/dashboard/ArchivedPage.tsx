import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useUnarchiveBlog } from '@/api/hooks/useBlogMutations'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'

export function ArchivedPage() {
  const { data: blogs, isLoading } = useMyBlogs()
  const { mutate: unarchiveBlog } = useUnarchiveBlog()

  const archived = (blogs ?? []).filter((b) => b.status === 'archived')

  function handleUnarchive(slug: string, title: string) {
    if (!confirm(`Unarchive "${title}"? It will be republished.`)) return
    unarchiveBlog(slug, {
      onSuccess: () => toast.success('Blog unarchived and republished.'),
      onError: () => toast.error('Failed to unarchive.'),
    })
  }

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            Archived{' '}
            <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}>· {archived.length}</span>
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
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 200 }} />
          ))}
        </div>
      ) : archived.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 14 }}>No archived blogs</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>
            Archive a published blog from the Published tab to hide it from public pages.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {archived.map((blog) => (
            <div
              key={blog.id}
              className="rounded-[6px] border border-line overflow-hidden flex flex-col"
              style={{ opacity: 0.75 }}
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
                  <span className="font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px', background: 'var(--ls-bg-soft)', color: 'var(--ls-ink-3)', border: '1px solid var(--ls-line)' }}>
                    archived
                  </span>
                  <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px' }}>
                    {articleTypeLabel(blog.articleType)}
                  </span>
                </div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, lineHeight: 1.25 }}>
                  {blog.title || <em className="text-ink-3">Untitled</em>}
                </div>
                <div className="flex items-center text-ink-3 mt-auto" style={{ fontSize: 11, gap: 6 }}>
                  {formatDateShort(blog.updatedAt)}
                  <span className="flex-1" />
                  <div className="flex" style={{ gap: 8 }}>
                    <Link
                      to={buildRoute.editor(blog.slug)}
                      className="text-ink-3 hover:text-ink transition-colors"
                      style={{ fontSize: 12 }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleUnarchive(blog.slug, blog.title)}
                      className="text-ink-2 hover:text-ink transition-colors"
                      style={{ fontSize: 12 }}
                    >
                      Unarchive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
