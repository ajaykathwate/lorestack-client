import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import 'react-quill/dist/quill.snow.css'
import { useBlogBySlug } from '@/api/hooks/useBlogQueries'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

// Configure marked for clean HTML output
marked.setOptions({ breaks: true, gfm: true })

function renderBody(body: string): string {
  // If the body contains HTML tags it was saved by ReactQuill — use as-is
  if (/<[a-z][\s\S]*>/i.test(body)) return body
  // Otherwise treat as markdown
  return marked.parse(body) as string
}

function plainText(body: string): string {
  // Strip HTML tags (from Quill HTML or markdown-rendered HTML) to get plain text
  const html = renderBody(body)
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function BlogPage() {
  const { slug = '' } = useParams()
  const { data: blog, isLoading, error } = useBlogBySlug(slug)

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

  const plain = plainText(blog.body ?? '')
  const wordCount = plain ? plain.split(' ').filter(Boolean).length : 0
  const readMin = Math.max(1, Math.ceil(wordCount / 200))

  const renderedBody = blog.body ? renderBody(blog.body) : null

  return (
    <div className="flex flex-col">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr min(720px, 100%) 1fr' }}>
        <div />
        <article style={{ padding: '40px 0 60px' }}>

          {/* Article type badge */}
          <span
            className="inline-block font-mono rounded-[3px]"
            style={{ fontSize: 11, padding: '3px 8px', background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)', border: '1px solid var(--ls-accent-soft)' }}
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

          {/* Summary / lede */}
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
              {initials('A')}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-ink" style={{ fontSize: 13 }}>Author</div>
              <div className="text-ink-3" style={{ fontSize: 11 }}>
                {blog.publishedAt ? formatDate(blog.publishedAt) : 'Draft'}
                {wordCount > 0 && ` · ${readMin} min read`}
              </div>
            </div>
            <button
              className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
              style={{ padding: '5px 10px', fontSize: 12 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: blog.title, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
            >
              ↗ Share
            </button>
          </div>

          {/* Cover image — only shown when available */}
          {blog.coverImageUrl && (
            <img
              src={blog.coverImageUrl}
              alt={blog.title}
              className="w-full rounded-[6px] object-cover"
              style={{ marginTop: 24, maxHeight: 400, display: 'block' }}
            />
          )}

          {/* Body — rendered from Quill HTML or markdown */}
          {renderedBody && (
            <div className="ql-snow" style={{ marginTop: blog.coverImageUrl ? 28 : 24 }}>
              <div
                className="ql-editor"
                style={{
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'var(--ls-ink)',
                  padding: 0,
                }}
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            </div>
          )}

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap" style={{ marginTop: 36, gap: 6 }}>
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
          <div
            style={{
              marginTop: 32,
              display: 'grid',
              gridTemplateColumns: blog.companyId ? '1fr 1fr' : '1fr',
              gap: 14,
            }}
          >
            {/* Author card */}
            <div className="rounded-[6px] border border-line flex" style={{ padding: 16, gap: 12 }}>
              <div
                className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
                style={{ width: 48, height: 48, fontSize: 16 }}
              >
                {initials('A')}
              </div>
              <div className="flex-1">
                <div className="text-ink-3 font-mono uppercase" style={{ fontSize: 9, letterSpacing: '1px', marginBottom: 3 }}>Written by</div>
                <div className="font-semibold text-ink" style={{ fontSize: 14 }}>Author</div>
                <div className="text-ink-3" style={{ fontSize: 11, marginBottom: 8 }}>
                  Engineering writer
                </div>
                <button
                  className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '3px 10px', fontSize: 11 }}
                >
                  + Follow
                </button>
              </div>
            </div>

            {/* Company card */}
            {blog.companyId && (
              <div className="rounded-[6px] border border-line flex" style={{ padding: 16, gap: 12 }}>
                <div
                  className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
                  style={{ width: 48, height: 48, fontSize: 18 }}
                >
                  C
                </div>
                <div className="flex-1">
                  <div className="text-ink-3 font-mono uppercase" style={{ fontSize: 9, letterSpacing: '1px', marginBottom: 3 }}>Published by</div>
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
        </article>
        <div />
      </div>
    </div>
  )
}
