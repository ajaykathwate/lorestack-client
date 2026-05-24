import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Globe, Pencil } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProfileByUsername, useAuthorBlogs } from '@/api/hooks/useProfileQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function MyProfilePage() {
  const { authorProfile } = useAuthStore()
  const username = authorProfile?.username ?? ''

  const { data: profile, isLoading } = useProfileByUsername(username)
  const { data: blogs } = useAuthorBlogs(username)
  const articles = blogs ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ paddingTop: 80 }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6">
      {/* Banner */}
      <div
        className="border-b border-line flex flex-wrap gap-5"
        style={{ padding: '28px 24px 20px', alignItems: 'flex-start' }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 72, height: 72 }}
          />
        ) : (
          <div
            className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
            style={{ width: 72, height: 72, fontSize: 24 }}
          >
            {initials(profile.displayName)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
            Your public profile
          </span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 28, marginTop: 4 }}>
            {profile.displayName}
          </h1>
          <div className="font-mono text-ink-3" style={{ fontSize: 12, marginTop: 2 }}>@{profile.username}</div>

          {profile.bio && (
            <p className="text-ink-2" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, maxWidth: 520 }}>
              {profile.bio}
            </p>
          )}

          {/* Social links */}
          <div className="flex" style={{ gap: 12, marginTop: 10 }}>
            {profile.websiteUrl && (
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-ink-3 hover:text-ink transition-colors">
                <Globe size={14} />
              </a>
            )}
            {profile.twitterHandle && (
              <a href={`https://twitter.com/${profile.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="text-ink-3 hover:text-ink transition-colors">
                <Twitter size={14} />
              </a>
            )}
            {profile.githubHandle && (
              <a href={`https://github.com/${profile.githubHandle}`} target="_blank" rel="noopener noreferrer" className="text-ink-3 hover:text-ink transition-colors">
                <Github size={14} />
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-ink-3 hover:text-ink transition-colors">
                <Linkedin size={14} />
              </a>
            )}
          </div>

          {/* Expertise tags */}
          {profile.expertiseTags && profile.expertiseTags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 8, marginTop: 10 }}>
              {profile.expertiseTags.map((tag) => (
                <Link
                  key={tag}
                  to={buildRoute.tag(tag)}
                  className="text-ink-3 hover:text-ink transition-colors"
                  style={{ fontSize: 12, textDecoration: 'none' }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to={ROUTES.PROFILE_SETTINGS}
          className="flex items-center border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors"
          style={{ gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none', flexShrink: 0 }}
        >
          <Pencil size={13} />
          Edit profile
        </Link>
      </div>

      {/* Articles */}
      <div style={{ padding: '24px' }}>
        <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 16 }}>
          Published articles · {articles.length}
        </div>

        {articles.length === 0 ? (
          <div className="rounded-[8px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
            <p className="text-ink-3" style={{ fontSize: 13 }}>No published articles yet.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {articles.map((blog) => (
              <Link
                key={blog.id}
                to={buildRoute.blog(blog.slug)}
                className="hover:bg-bg-tint transition-colors"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 18,
                  padding: '16px 0', borderTop: '1px solid var(--ls-line-soft)',
                  textDecoration: 'none',
                }}
              >
                <div>
                  <span
                    className="font-mono rounded-[3px]"
                    style={{ fontSize: 10, padding: '2px 6px', background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)' }}
                  >
                    {articleTypeLabel(blog.articleType)}
                  </span>
                  <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 8 }}>
                    {blog.title}
                  </h3>
                  {blog.summary && (
                    <p className="text-ink-2" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5 }}>
                      {blog.summary}
                    </p>
                  )}
                  <div className="text-ink-3" style={{ fontSize: 11, marginTop: 8 }}>
                    {formatDateShort(blog.publishedAt ?? blog.createdAt)}
                  </div>
                </div>
                {blog.coverImageUrl ? (
                  <img
                    src={blog.coverImageUrl}
                    alt=""
                    className="rounded-[4px] object-cover flex-shrink-0"
                    style={{ width: 120, height: 90 }}
                  />
                ) : (
                  <div
                    className="rounded-[4px] bg-bg-tint border border-line flex-shrink-0"
                    style={{ width: 120, height: 90 }}
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
