import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useDeleteBlog } from '@/api/hooks/useBlogMutations'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'

export function MyBlogsPage() {
  const { data: blogs, isLoading } = useMyBlogs()
  const { mutate: deleteBlog } = useDeleteBlog()

  const published = (blogs ?? []).filter((b) => b.status === 'published')

  function handleDelete(slug: string) {
    if (!confirm('Delete this blog permanently?')) return
    deleteBlog(slug, {
      onSuccess: () => toast.success('Blog deleted.'),
      onError: () => toast.error('Failed to delete blog.'),
    })
  }

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            My published blogs
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
      ) : published.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 14 }}>No published blogs yet</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>
            Publish your first blog to see it here.
          </p>
          <Link
            to={ROUTES.EDITOR_NEW}
            className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            + Write blog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {published.map((blog) => (
            <div
              key={blog.id}
              className="rounded-[6px] border border-line overflow-hidden flex flex-col"
            >
              <div className="bg-bg-tint" style={{ height: 92 }} />
              <div className="flex flex-col flex-1" style={{ padding: '10px 12px', gap: 6 }}>
                <span className="border border-line text-ink-2 rounded-[3px] self-start" style={{ fontSize: 10, padding: '2px 6px' }}>
                  {articleTypeLabel(blog.articleType)}
                </span>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, lineHeight: 1.25 }}>
                  {blog.title}
                </div>
                <div className="flex items-center text-ink-3 mt-auto" style={{ fontSize: 11, gap: 6 }}>
                  {blog.publishedAt ? formatDateShort(blog.publishedAt) : '—'}
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
                      onClick={() => handleDelete(blog.slug)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      style={{ fontSize: 12 }}
                    >
                      Delete
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
