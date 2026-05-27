import { Link } from 'react-router-dom'
import { Bookmark, Heart, Eye, Clock } from 'lucide-react'
import { useSavedArticles } from '@/api/hooks/useSavedQuery'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function SavedPage() {
  const { data, isLoading } = useSavedArticles(1)
  const articles = data?.data ?? []

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26 }}>Saved articles</h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
          Articles you've bookmarked for later
          {data?.meta?.total != null && data.meta.total > 0 && ` · ${data.meta.total} saved`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center" style={{ paddingTop: 48 }}>
          <Spinner size="lg" />
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center rounded-[8px] border border-line" style={{ padding: '64px 32px', gap: 12 }}>
          <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center text-ink-3" style={{ width: 56, height: 56 }}>
            <Bookmark size={24} />
          </div>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18 }}>No saved articles yet</h3>
          <p className="text-ink-3" style={{ maxWidth: 340, fontSize: 13, lineHeight: 1.6 }}>
            When you save an article, it will appear here. Browse articles and click the bookmark button to save them.
          </p>
          <Link
            to="/explore"
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
            style={{ padding: '8px 18px', fontSize: 13, marginTop: 8 }}
          >
            Browse articles →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {articles.map((blog) => (
            <Link
              key={blog.id}
              to={buildRoute.blog(blog.slug)}
              className="flex gap-4 hover:bg-bg-tint transition-colors rounded-[6px]"
              style={{ padding: '16px 14px', borderBottom: '1px solid var(--ls-line-soft)' }}
            >
              {/* Cover thumbnail */}
              <div className="flex-shrink-0 rounded-[4px] overflow-hidden bg-bg-tint border border-line" style={{ width: 88, height: 64 }}>
                {blog.coverImageUrl ? (
                  <img src={blog.coverImageUrl} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center" style={{ gap: 6, marginBottom: 5 }}>
                  <span
                    className="font-mono rounded-[3px]"
                    style={{ fontSize: 10, padding: '2px 6px', background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)' }}
                  >
                    {articleTypeLabel(blog.articleType)}
                  </span>
                  {blog.authorProfile && (
                    <span className="text-ink-3" style={{ fontSize: 11 }}>
                      by {blog.authorProfile.displayName}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-semibold text-ink line-clamp-2" style={{ fontSize: 15, lineHeight: 1.35 }}>
                  {blog.title}
                </h3>

                {blog.summary && (
                  <p className="text-ink-3 line-clamp-1" style={{ fontSize: 12, marginTop: 4 }}>{blog.summary}</p>
                )}

                {/* Metrics row */}
                <div className="flex items-center flex-wrap" style={{ gap: 12, marginTop: 8 }}>
                  {blog.publishedAt && (
                    <span className="text-ink-3" style={{ fontSize: 11 }}>
                      {formatDateShort(blog.publishedAt)}
                    </span>
                  )}
                  {blog.readingTimeMinutes && (
                    <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 11 }}>
                      <Clock size={10} />
                      {blog.readingTimeMinutes} min
                    </span>
                  )}
                  {blog.likesCount > 0 && (
                    <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 11 }}>
                      <Heart size={10} />
                      {blog.likesCount}
                    </span>
                  )}
                  {blog.viewsCount > 0 && (
                    <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 11 }}>
                      <Eye size={10} />
                      {blog.viewsCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {data && data.meta.total > articles.length && (
            <div className="flex justify-center" style={{ paddingTop: 24 }}>
              <p className="text-ink-3" style={{ fontSize: 12 }}>
                Showing {articles.length} of {data.meta.total} saved articles
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
