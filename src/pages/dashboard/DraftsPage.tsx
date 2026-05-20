import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMyBlogs } from '@/api/hooks/useBlogQueries'
import { useDeleteBlog, usePublishBlog } from '@/api/hooks/useBlogMutations'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'

export function DraftsPage() {
  const { data: blogs, isLoading } = useMyBlogs()
  const { mutate: deleteBlog } = useDeleteBlog()
  const { mutate: publishBlog } = usePublishBlog()

  const drafts = (blogs ?? []).filter((b) => b.status === 'draft')

  function handleDelete(slug: string) {
    if (!confirm('Delete this draft permanently?')) return
    deleteBlog(slug, {
      onSuccess: () => toast.success('Draft deleted.'),
      onError: () => toast.error('Failed to delete draft.'),
    })
  }

  function handlePublish(slug: string, title: string) {
    publishBlog(slug, {
      onSuccess: () => toast.success(`"${title}" published!`),
      onError: () => toast.error('Failed to publish.'),
    })
  }

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Writing</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
            Drafts <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}>· {drafts.length}</span>
          </h1>
        </div>
        <Link
          to={ROUTES.EDITOR_NEW}
          className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          + New draft
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col" style={{ gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 72 }} />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 14 }}>No drafts</h3>
          <p className="text-ink-2" style={{ margin: '6px 0 16px', fontSize: 13 }}>Start writing to save a draft.</p>
          <Link
            to={ROUTES.EDITOR_NEW}
            className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            + Write blog
          </Link>
        </div>
      ) : (
        <div className="rounded-[6px] border border-line overflow-hidden">
          {drafts.map((blog, i) => (
            <div
              key={blog.id}
              className="flex items-center"
              style={{
                padding: '14px 16px',
                borderTop: i ? '1px solid var(--ls-line-soft)' : 'none',
                gap: 14,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
              }}
            >
              <div>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                  <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px' }}>
                    {articleTypeLabel(blog.articleType)}
                  </span>
                  <span className="text-ink-3" style={{ fontSize: 11 }}>
                    edited {formatDateShort(blog.updatedAt)}
                  </span>
                </div>
                <div className="font-serif font-semibold text-ink" style={{ fontSize: 15, lineHeight: 1.2 }}>
                  {blog.title || <span className="text-ink-3 italic">Untitled</span>}
                </div>
              </div>
              <div className="flex" style={{ gap: 8 }}>
                <button
                  onClick={() => handlePublish(blog.slug, blog.title)}
                  className="border border-line text-ink-2 font-medium rounded-[4px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  Publish
                </button>
                <Link
                  to={buildRoute.editor(blog.slug)}
                  className="bg-ink text-bg font-medium rounded-[4px] hover:bg-black transition-colors"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog.slug)}
                  className="text-ink-3 hover:text-red-500 transition-colors"
                  style={{ padding: '6px 4px', fontSize: 12 }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
