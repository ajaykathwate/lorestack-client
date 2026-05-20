import { useParams, Link } from 'react-router-dom'
import { useBlogBySlug, useCompanyBlogs } from '@/api/hooks/useBlogQueries'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function BlogPage() {
  const { slug = '' } = useParams()
  const { data: blog, isLoading, error } = useBlogBySlug(slug)
  const { data: relatedBlogs } = useCompanyBlogs(blog?.companyId ? '' : '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" style={{ gap: 12 }}>
        <p className="font-mono text-ink-3 uppercase" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Not found</p>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 28 }}>This article doesn't exist.</h1>
        <Link to="/" className="text-ls-accent underline underline-offset-2" style={{ fontSize: 13 }}>
          ← Back to homepage
        </Link>
      </div>
    )
  }

  const blogInitials = initials('A')

  return (
    <div className="flex flex-col">
      <div style={{ padding: '0', display: 'grid', gridTemplateColumns: '1fr min(680px, 100%) 1fr' }}>
        <div />
        <article style={{ padding: '40px 0 24px' }}>
          {/* Type badge */}
          <span
            className="inline-block bg-ls-accent text-white font-mono rounded-[3px]"
            style={{ fontSize: 11, padding: '3px 8px' }}
          >
            {articleTypeLabel(blog.articleType)}
          </span>

          {/* Title */}
          <h1
            className="font-serif font-bold text-ink"
            style={{ fontSize: 40, marginTop: 14, marginBottom: 14, lineHeight: 1.05 }}
          >
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p className="font-serif text-ink-2" style={{ fontSize: 18, lineHeight: 1.5, margin: '0 0 22px' }}>
              {blog.summary}
            </p>
          )}

          {/* Author strip */}
          <div
            className="flex items-center"
            style={{ gap: 12, paddingBottom: 18, borderBottom: '1px solid var(--ls-line)' }}
          >
            <div
              className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
              style={{ width: 36, height: 36, fontSize: 13 }}
            >
              {blogInitials}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-ink" style={{ fontSize: 13 }}>Author</div>
              <div className="text-ink-3" style={{ fontSize: 11 }}>
                {blog.publishedAt ? formatDate(blog.publishedAt) : 'Draft'} · 8 min read
              </div>
            </div>
            <button
              className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
              style={{ padding: '5px 10px', fontSize: 12 }}
            >
              ↗ Share
            </button>
          </div>

          {/* Cover image */}
          {blog.coverImageUrl ? (
            <img
              src={blog.coverImageUrl}
              alt={blog.title}
              className="w-full rounded-[6px] object-cover"
              style={{ marginTop: 24, height: 300 }}
            />
          ) : (
            <div
              className="w-full rounded-[6px] bg-bg-tint border border-line"
              style={{ marginTop: 24, height: 300 }}
            />
          )}

          {/* Body */}
          {blog.body && (
            <div
              className="font-serif text-ink"
              style={{ marginTop: 24, fontSize: 17, lineHeight: 1.65 }}
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />
          )}

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap" style={{ marginTop: 28, gap: 6 }}>
              {blog.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={buildRoute.tag(tag.slug)}
                  className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors"
                  style={{ padding: '4px 12px', fontSize: 12 }}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Author + company cards */}
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="rounded-[6px] border border-line flex" style={{ padding: 16, gap: 12 }}>
              <div
                className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
                style={{ width: 48, height: 48, fontSize: 16 }}
              >
                {blogInitials}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-ink" style={{ fontSize: 14 }}>Author</div>
                <div className="text-ink-3" style={{ fontSize: 11, marginBottom: 8 }}>
                  {blog.companyId ? 'Writing for this company' : 'Independent writer'}
                </div>
                <button
                  className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '3px 10px', fontSize: 11 }}
                >
                  + Follow
                </button>
              </div>
            </div>

            {blog.companyId && (
              <div className="rounded-[6px] border border-line flex" style={{ padding: 16, gap: 12 }}>
                <div
                  className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
                  style={{ width: 48, height: 48, fontSize: 18 }}
                >
                  C
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-ink" style={{ fontSize: 14 }}>Company</div>
                  <div className="text-ink-3" style={{ fontSize: 11, marginBottom: 8 }}>Engineering team</div>
                  <button
                    className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                    style={{ padding: '3px 10px', fontSize: 11 }}
                  >
                    + Follow company
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Related articles */}
          {(relatedBlogs ?? []).length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div
                className="font-mono uppercase text-ink-3"
                style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}
              >
                Related articles
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(relatedBlogs ?? []).slice(0, 3).filter((b) => b.slug !== slug).map((b) => (
                  <Link
                    key={b.id}
                    to={buildRoute.blog(b.slug)}
                    className="rounded-[6px] border border-line overflow-hidden hover:border-line-strong transition-colors"
                  >
                    <div className="bg-bg-tint" style={{ height: 80 }} />
                    <div style={{ padding: 10 }}>
                      <span
                        className="border border-line text-ink-2 rounded-[3px]"
                        style={{ fontSize: 9, padding: '1px 5px' }}
                      >
                        {articleTypeLabel(b.articleType)}
                      </span>
                      <div className="font-serif font-semibold text-ink" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.3 }}>
                        {b.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
        <div />
      </div>
    </div>
  )
}
