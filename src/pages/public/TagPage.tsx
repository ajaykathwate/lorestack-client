import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useTagBySlug } from '@/api/hooks/useTagQueries'
import { useFollowTag, useUnfollowTag } from '@/api/hooks/useTagMutations'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { useAuthStore } from '@/store/authStore'
import { buildRoute } from '@/constants/routes'
import { formatDateShort } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

const RELATED_TAGS = ['kafka', 'migrations', 'observability', 'sqlite', 'vacuum', 'indices', 'replication', 'wal']

export function TagPage() {
  const { slug = '' } = useParams()
  const { isAuthenticated } = useAuthStore()
  const { data: tag, isLoading: tagLoading } = useTagBySlug(slug)
  const { data: blogs, isLoading: blogsLoading } = useExplore(slug ? { tag: slug } : undefined)

  const { mutate: followTag, isPending: following } = useFollowTag()
  const { mutate: unfollowTag, isPending: unfollowing } = useUnfollowTag()

  const [isFollowing, setIsFollowing] = useState(false)

  const articles = blogs ?? []
  const isLoading = tagLoading || blogsLoading

  function handleFollow() {
    if (!isAuthenticated) { toast.error('Sign in to follow tags.'); return }
    if (!tag?.id) return
    if (isFollowing) {
      unfollowTag(tag.id, { onSuccess: () => setIsFollowing(false) })
    } else {
      followTag(tag.id, { onSuccess: () => setIsFollowing(true) })
    }
  }

  if (tagLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="border-b border-line"
        style={{ padding: '40px 48px 18px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'end' }}
      >
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Topic</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 44, marginTop: 6 }}>
            #{tag?.name ?? slug}
          </h1>
          <p className="font-serif text-ink-2" style={{ maxWidth: 520, marginTop: 8, fontSize: 14 }}>
            Engineering writing about {tag?.name ?? slug} on Lorestack.{' '}
            <span className="text-ink-3">
              {articles.length} articles
              {tag?.blogCount != null && ` · ${tag.blogCount} total`}
            </span>
          </p>
          {tag?.description && (
            <p className="text-ink-2" style={{ marginTop: 6, fontSize: 13 }}>{tag.description}</p>
          )}
        </div>
        <div className="flex justify-end" style={{ gap: 8 }}>
          <button
            onClick={handleFollow}
            disabled={following || unfollowing}
            className="font-medium rounded-[6px] transition-colors"
            style={{
              padding: '8px 14px', fontSize: 13,
              background: isFollowing ? 'var(--ls-accent-soft)' : 'transparent',
              color: isFollowing ? 'var(--ls-accent-ink)' : 'var(--ls-ink-2)',
              border: isFollowing ? '1px solid var(--ls-accent)' : '1px solid var(--ls-line)',
            }}
          >
            {isFollowing ? '✓ Following' : '+ Follow tag'}
          </button>
          <button
            className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            ↗ RSS
          </button>
        </div>
      </div>

      {/* Companies strip */}
      <div
        className="border-b border-line bg-bg-soft flex items-center"
        style={{ padding: '18px 48px', gap: 14 }}
      >
        <span className="font-mono uppercase text-ink-3 flex-shrink-0" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Companies writing about {tag?.name ?? slug}
        </span>
        <div className="flex" style={{ gap: 8 }}>
          {['A', 'H', 'N', 'Q', 'L', 'V', 'S', 'P'].map((letter, i) => (
            <div
              key={i}
              className="rounded-[4px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2"
              style={{ width: 28, height: 28, fontSize: 11 }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <button className="text-ink-3 hover:text-ink-2" style={{ fontSize: 11 }}>see all →</button>
      </div>

      {/* Main content */}
      <div style={{ padding: '24px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
        {/* Articles */}
        <div>
          <div className="flex" style={{ gap: 6, marginBottom: 12 }}>
            {['Newest', 'Most read', 'Trending'].map((label, i) => (
              <button
                key={label}
                className={`rounded-full border font-sans transition-colors ${
                  i === 0
                    ? 'bg-ink text-bg border-ink'
                    : 'border-line text-ink-2 hover:border-line-strong hover:text-ink bg-bg'
                }`}
                style={{ padding: '4px 12px', fontSize: 12 }}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex flex-col" style={{ gap: 14 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 120 }} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No articles yet for #{slug}.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {articles.map((blog) => (
                <Link
                  key={blog.id}
                  to={buildRoute.blog(blog.slug)}
                  className="hover:bg-bg-tint transition-colors"
                  style={{ padding: '14px 0', borderTop: '1px solid var(--ls-line-soft)', display: 'grid', gridTemplateColumns: '1fr 160px', gap: 18 }}
                >
                  <div>
                    <div className="flex items-center" style={{ gap: 8, fontSize: 11, color: 'var(--ls-ink-3)' }}>
                      {formatDateShort(blog.publishedAt ?? blog.createdAt)} · 8 min
                    </div>
                    <h3 className="font-serif font-bold text-ink" style={{ fontSize: 20, marginTop: 8 }}>
                      {blog.title}
                    </h3>
                    {blog.summary && (
                      <p className="font-serif text-ink-2" style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.5 }}>
                        {blog.summary}
                      </p>
                    )}
                    <div className="flex" style={{ gap: 6, marginTop: 8 }}>
                      {blog.tags.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className="border border-line text-ink-2 rounded-full"
                          style={{ padding: '2px 8px', fontSize: 11 }}
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[4px] bg-bg-tint border border-line" style={{ height: 100 }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right rail — related tags */}
        <div>
          <div
            className="font-mono uppercase text-ink-3"
            style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}
          >
            Related tags
          </div>
          <div className="flex flex-wrap" style={{ gap: 6 }}>
            {RELATED_TAGS.map((t) => (
              <Link
                key={t}
                to={buildRoute.tag(t)}
                className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors"
                style={{ padding: '4px 12px', fontSize: 12 }}
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
