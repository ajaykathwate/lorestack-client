import { Link } from 'react-router-dom'
import { Heart, Bookmark, Clock } from 'lucide-react'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import type { BlogSummary } from '@/types/api'

export function BlogFeedCard({ blog }: { blog: BlogSummary }) {
  const author = blog.authorProfile
  const company = blog.company
  const hasMetrics = blog.readingTimeMinutes != null || blog.likesCount > 0 || blog.savesCount > 0
  const hasTags = blog.tags.length > 0

  return (
    <Link
      to={buildRoute.blog(blog.slug)}
      className="flex flex-col bg-bg border border-line rounded-[8px] hover:border-line-strong hover:shadow-sm transition-all"
      style={{ padding: '16px 18px', marginBottom: 10, gap: 10, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
    >
      {/* Author row */}
      <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
        <UserAvatar avatarUrl={author?.avatarUrl} name={author?.displayName} size={20} />
        <span className="text-ink-2 font-medium" style={{ fontSize: 12 }}>
          {author?.displayName ?? 'Unknown'}
        </span>
        {company && (
          <>
            <span className="text-ink-3" style={{ fontSize: 11 }}>in</span>
            <span className="text-ink-2 font-medium" style={{ fontSize: 12 }}>{company.name}</span>
          </>
        )}
        <span className="text-ink-3" style={{ fontSize: 11 }}>·</span>
        <span className="text-ink-3" style={{ fontSize: 12 }}>
          {formatDateShort(blog.publishedAt ?? blog.createdAt)}
        </span>
      </div>

      {/* Title + thumbnail row */}
      <div className="flex items-start" style={{ gap: 14 }}>
        <div className="flex-1 min-w-0">
          <span
            className="font-mono text-ls-accent"
            style={{ fontSize: 10, letterSpacing: '0.4px' }}
          >
            {articleTypeLabel(blog.articleType)}
          </span>
          <h3
            className="font-serif font-bold text-ink"
            style={{ fontSize: 17, lineHeight: 1.25, marginTop: 3 }}
          >
            {blog.title}
          </h3>
          {blog.summary && (
            <p
              className="text-ink-2"
              style={{
                fontSize: 13, lineHeight: 1.55, marginTop: 5,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}
            >
              {blog.summary}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 rounded-[6px] overflow-hidden" style={{ width: 110, height: 74 }}>
          {blog.coverImageUrl ? (
            <img
              src={blog.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-bg-soft border border-line rounded-[6px]" />
          )}
        </div>
      </div>

      {/* Tags + metrics row — only if there's something to show */}
      {(hasTags || hasMetrics) && (
        <div className="flex items-center flex-wrap" style={{ gap: '4px 10px', paddingTop: 6, borderTop: '1px solid var(--ls-line-soft)' }}>
          {hasTags && blog.tags.slice(0, 4).map((tag) => (
            <span
              key={tag.id}
              className="font-mono text-ink-3"
              style={{ fontSize: 11 }}
            >
              #{tag.name}
            </span>
          ))}
          {hasMetrics && (
            <div className="flex items-center ml-auto" style={{ gap: 8 }}>
              {blog.readingTimeMinutes != null && (
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
              {blog.savesCount > 0 && (
                <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 11 }}>
                  <Bookmark size={10} />
                  {blog.savesCount}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </Link>
  )
}
