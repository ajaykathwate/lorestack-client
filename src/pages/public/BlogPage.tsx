import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import { toast } from 'sonner'
import { Heart, Bookmark, Share2, Check, ArrowLeft } from 'lucide-react'
import 'react-quill/dist/quill.snow.css'
import { useBlogBySlug } from '@/api/hooks/useBlogQueries'
import { useEngagement, useMyEngagement } from '@/api/hooks/useEngagementQueries'
import {
  useLikeBlog, useUnlikeBlog,
  useSaveBlog, useUnsaveBlog,
  useShareBlog, useRecordView,
} from '@/api/hooks/useEngagementMutations'
import { useAuthStore } from '@/store/authStore'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

marked.setOptions({ breaks: true, gfm: true })

function renderBody(body: string): string {
  if (/<[a-z][\s\S]*>/i.test(body)) return body
  return marked.parse(body) as string
}

function plainText(body: string): string {
  const html = renderBody(body)
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function BlogPage() {
  const { slug = '' } = useParams()
  const { isAuthenticated } = useAuthStore()

  const { data: blog, isLoading, error } = useBlogBySlug(slug)
  const { data: engagement } = useEngagement(slug)
  const { data: myEngagement } = useMyEngagement(slug)

  const { mutate: recordView } = useRecordView(slug)
  const { mutate: like, isPending: liking } = useLikeBlog(slug)
  const { mutate: unlike, isPending: unliking } = useUnlikeBlog(slug)
  const { mutate: save, isPending: saving } = useSaveBlog(slug)
  const { mutate: unsave, isPending: unsaving } = useUnsaveBlog(slug)
  const { mutate: share } = useShareBlog(slug)

  const [copied, setCopied] = useState(false)

  // Record view once when blog loads
  useEffect(() => {
    if (slug) recordView({ source: 'direct' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

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
        <Link to="/" className="flex items-center text-ls-accent underline underline-offset-2" style={{ fontSize: 13, gap: 4 }}>
          <ArrowLeft size={13} /> Back to homepage
        </Link>
      </div>
    )
  }

  const plain = plainText(blog.body ?? '')
  const wordCount = plain ? plain.split(' ').filter(Boolean).length : 0
  const readMin = blog.readingTimeMinutes ?? Math.max(1, Math.ceil(wordCount / 200))
  const renderedBody = blog.body ? renderBody(blog.body) : null

  const author = blog.authorProfile
  const company = blog.company
  const authorName = author?.displayName ?? 'Author'
  const authorUsername = author?.username
  const companyName = company?.name ?? 'Company'
  const companyHandle = company?.handle

  const isLiked = myEngagement?.isLiked ?? false
  const isSaved = myEngagement?.isSaved ?? false
  const likesCount = engagement?.likesCount ?? 0
  const savesCount = engagement?.savesCount ?? 0
  const sharesCount = engagement?.sharesCount ?? 0

  function handleLike() {
    if (!isAuthenticated) { toast.error('Sign in to like articles.'); return }
    if (isLiked) unlike()
    else like()
  }

  function handleSave() {
    if (!isAuthenticated) { toast.error('Sign in to save articles.'); return }
    if (isSaved) unsave()
    else save()
  }

  function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: blog.title, url }).then(() => share('other'))
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      share('copy_link')
    }
  }

  return (
    <div className="flex flex-col">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr min(740px, 100%) 1fr' }}>
        <div />
        <article className="px-4 sm:px-6 lg:px-0" style={{ paddingTop: 40, paddingBottom: 80 }}>

          {/* Article type badge */}
          <span
            className="inline-block font-mono rounded-[3px]"
            style={{
              fontSize: 10, padding: '3px 9px',
              background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)',
              letterSpacing: '0.5px',
            }}
          >
            {articleTypeLabel(blog.articleType)}
          </span>

          {/* Title */}
          <h1
            className="font-serif font-bold text-ink"
            style={{ fontSize: 42, marginTop: 16, marginBottom: 12, lineHeight: 1.08, letterSpacing: '-0.3px' }}
          >
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p className="font-serif text-ink-2" style={{ fontSize: 19, lineHeight: 1.55, margin: '0 0 24px' }}>
              {blog.summary}
            </p>
          )}

          {/* Author strip */}
          <div
            className="flex items-center"
            style={{ gap: 12, paddingBottom: 20, borderBottom: '1px solid var(--ls-line)' }}
          >
            {/* Author avatar */}
            {authorUsername ? (
              <Link to={buildRoute.author(authorUsername)} className="flex-shrink-0">
                {author?.avatarUrl ? (
                  <img src={author.avatarUrl} alt={authorName} className="rounded-full object-cover" style={{ width: 38, height: 38 }} />
                ) : (
                  <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2" style={{ width: 38, height: 38, fontSize: 13 }}>
                    {initials(authorName)}
                  </div>
                )}
              </Link>
            ) : (
              <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0" style={{ width: 38, height: 38, fontSize: 13 }}>
                {initials(authorName)}
              </div>
            )}

            <div className="flex-1">
              {authorUsername ? (
                <Link to={buildRoute.author(authorUsername)} className="font-semibold text-ink hover:text-ls-accent transition-colors" style={{ fontSize: 13 }}>
                  {authorName}
                </Link>
              ) : (
                <div className="font-semibold text-ink" style={{ fontSize: 13 }}>{authorName}</div>
              )}
              <div className="text-ink-3" style={{ fontSize: 11, marginTop: 1 }}>
                {blog.publishedAt ? formatDate(blog.publishedAt) : 'Draft'}
                {` · ${readMin} min read`}
                {companyHandle && (
                  <>
                    {' · '}
                    <Link to={buildRoute.company(companyHandle)} className="hover:text-ink transition-colors">
                      {companyName}
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center" style={{ gap: 6 }}>
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={liking || unliking}
                className="flex items-center gap-1.5 border rounded-[4px] transition-colors"
                style={{
                  padding: '5px 10px', fontSize: 12,
                  borderColor: isLiked ? 'var(--ls-accent)' : 'var(--ls-line)',
                  background: isLiked ? 'var(--ls-accent-soft)' : 'transparent',
                  color: isLiked ? 'var(--ls-accent-ink)' : 'var(--ls-ink-2)',
                }}
              >
                <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                {likesCount > 0 ? likesCount : ''}
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving || unsaving}
                className="flex items-center gap-1.5 border rounded-[4px] transition-colors"
                style={{
                  padding: '5px 10px', fontSize: 12,
                  borderColor: isSaved ? 'var(--ls-accent)' : 'var(--ls-line)',
                  background: isSaved ? 'var(--ls-accent-soft)' : 'transparent',
                  color: isSaved ? 'var(--ls-accent-ink)' : 'var(--ls-ink-2)',
                }}
              >
                <Bookmark size={12} fill={isSaved ? 'currentColor' : 'none'} />
                {savesCount > 0 ? savesCount : ''}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                style={{ padding: '5px 10px', fontSize: 12 }}
              >
                {copied ? <><Check size={12} /> Copied</> : <><Share2 size={12} /> Share{sharesCount > 0 ? ` · ${sharesCount}` : ''}</>}
              </button>
            </div>
          </div>

          {/* Cover image */}
          {blog.coverImageUrl && (
            <img
              src={blog.coverImageUrl}
              alt={blog.title}
              className="w-full rounded-[6px] object-cover"
              style={{ marginTop: 28, maxHeight: 420, display: 'block' }}
            />
          )}

          {/* Body */}
          {renderedBody && (
            <div className="ql-snow" style={{ marginTop: blog.coverImageUrl ? 32 : 28 }}>
              <div
                className="ql-editor"
                style={{
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  fontSize: 18,
                  lineHeight: 1.75,
                  color: 'var(--ls-ink)',
                  padding: 0,
                }}
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            </div>
          )}

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap" style={{ marginTop: 40, gap: 6 }}>
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
          <div className={`grid gap-4 mt-10 ${company && companyHandle ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Author card */}
            <div className="rounded-[8px] border border-line flex" style={{ padding: 18, gap: 14 }}>
              {authorUsername ? (
                <Link to={buildRoute.author(authorUsername)} className="flex-shrink-0">
                  {author?.avatarUrl ? (
                    <img src={author.avatarUrl} alt={authorName} className="rounded-full object-cover" style={{ width: 48, height: 48 }} />
                  ) : (
                    <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2" style={{ width: 48, height: 48, fontSize: 16 }}>
                      {initials(authorName)}
                    </div>
                  )}
                </Link>
              ) : (
                <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0" style={{ width: 48, height: 48, fontSize: 16 }}>
                  {initials(authorName)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-ink-3 font-mono uppercase" style={{ fontSize: 9, letterSpacing: '1px', marginBottom: 3 }}>Written by</div>
                {authorUsername ? (
                  <Link to={buildRoute.author(authorUsername)} className="font-semibold text-ink hover:text-ls-accent transition-colors block" style={{ fontSize: 14 }}>
                    {authorName}
                  </Link>
                ) : (
                  <div className="font-semibold text-ink" style={{ fontSize: 14 }}>{authorName}</div>
                )}
                {authorUsername && (
                  <div className="font-mono text-ink-3" style={{ fontSize: 11, marginBottom: 8 }}>@{authorUsername}</div>
                )}
                {authorUsername && (
                  <Link to={buildRoute.author(authorUsername)} className="inline-block border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors" style={{ padding: '3px 10px', fontSize: 11 }}>
                    View profile →
                  </Link>
                )}
              </div>
            </div>

            {/* Company card */}
            {company && companyHandle && (
              <div className="rounded-[8px] border border-line flex" style={{ padding: 18, gap: 14 }}>
                <Link to={buildRoute.company(companyHandle)} className="flex-shrink-0">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={companyName} className="rounded-[6px] object-cover" style={{ width: 48, height: 48 }} />
                  ) : (
                    <div className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2" style={{ width: 48, height: 48, fontSize: 18 }}>
                      {initials(companyName)}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-ink-3 font-mono uppercase" style={{ fontSize: 9, letterSpacing: '1px', marginBottom: 3 }}>Published by</div>
                  <Link to={buildRoute.company(companyHandle)} className="font-semibold text-ink hover:text-ls-accent transition-colors block" style={{ fontSize: 14 }}>
                    {companyName}
                  </Link>
                  <div className="font-mono text-ink-3" style={{ fontSize: 11, marginBottom: 8 }}>@{companyHandle}</div>
                  <Link to={buildRoute.company(companyHandle)} className="inline-block border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors" style={{ padding: '3px 10px', fontSize: 11 }}>
                    View company →
                  </Link>
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
