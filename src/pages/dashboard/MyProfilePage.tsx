import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Globe, Pencil, ExternalLink, BookOpen, Users } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProfileByUsername, useAuthorBlogs } from '@/api/hooks/useProfileQueries'
import { useFollowerAuthors } from '@/api/hooks/useFollowersQueries'
import { useFollowingAuthors } from '@/api/hooks/useFollowingQueries'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function MyProfilePage() {
  const { authorProfile } = useAuthStore()
  const username = authorProfile?.username ?? ''

  const { data: profile, isLoading } = useProfileByUsername(username)
  const { data: blogs = [] } = useAuthorBlogs(username)
  const { data: followers = [] } = useFollowerAuthors()
  const { data: following = [] } = useFollowingAuthors()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ paddingTop: 80 }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) return null

  const hasSocials = profile.twitterHandle || profile.linkedinUrl || profile.githubHandle || profile.websiteUrl
  const hasExpertise = profile.expertiseTags && profile.expertiseTags.length > 0

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6">

      {/* ── Profile banner ───────────────────────────────────────────────────── */}
      <div className="border-b border-line" style={{ padding: '28px 24px 24px' }}>
        <div className="flex flex-wrap gap-5" style={{ alignItems: 'flex-start' }}>

          {/* Avatar */}
          <UserAvatar avatarUrl={profile.avatarUrl} name={profile.displayName} size={80} />

          {/* Core info */}
          <div className="flex-1 min-w-0">
            <span className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.3px' }}>
              Your public profile
            </span>
            <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4, lineHeight: 1.15 }}>
              {profile.displayName}
            </h1>
            <div className="font-mono text-ink-3" style={{ fontSize: 12, marginTop: 3 }}>
              @{profile.username}
            </div>

            {profile.bio && (
              <p className="text-ink-2" style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.65, maxWidth: 500 }}>
                {profile.bio}
              </p>
            )}

            {/* Social links */}
            {hasSocials && (
              <div className="flex flex-wrap" style={{ gap: 12, marginTop: 12 }}>
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-ink-3 hover:text-ink transition-colors"
                    style={{ fontSize: 12 }}
                  >
                    <Globe size={13} />
                    <span>{profile.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  </a>
                )}
                {profile.twitterHandle && (
                  <a
                    href={`https://twitter.com/${profile.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-ink-3 hover:text-ink transition-colors"
                    style={{ fontSize: 12 }}
                  >
                    <Twitter size={13} />
                    <span>@{profile.twitterHandle}</span>
                  </a>
                )}
                {profile.githubHandle && (
                  <a
                    href={`https://github.com/${profile.githubHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-ink-3 hover:text-ink transition-colors"
                    style={{ fontSize: 12 }}
                  >
                    <Github size={13} />
                    <span>{profile.githubHandle}</span>
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-ink-3 hover:text-ink transition-colors"
                    style={{ fontSize: 12 }}
                  >
                    <Linkedin size={13} />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}

            {/* Expertise tags */}
            {hasExpertise && (
              <div className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }}>
                {profile.expertiseTags.map((tag: string) => (
                  <Link
                    key={tag}
                    to={buildRoute.tag(tag)}
                    className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:bg-bg-tint transition-all"
                    style={{ padding: '3px 10px', fontSize: 11.5, textDecoration: 'none' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col" style={{ gap: 8, flexShrink: 0 }}>
            <Link
              to={ROUTES.PROFILE_SETTINGS}
              className="flex items-center gap-1.5 border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors font-medium"
              style={{ padding: '7px 14px', fontSize: 13, textDecoration: 'none' }}
            >
              <Pencil size={13} />
              Edit profile
            </Link>
            {profile.username && (
              <Link
                to={buildRoute.author(profile.username)}
                className="flex items-center gap-1.5 border border-line text-ink-3 rounded-[6px] hover:bg-bg-tint hover:text-ink-2 transition-colors"
                style={{ padding: '7px 14px', fontSize: 13, textDecoration: 'none' }}
              >
                <ExternalLink size={12} />
                Public view
              </Link>
            )}
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div
          className="flex flex-wrap"
          style={{ gap: '8px 32px', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--ls-line-soft)' }}
        >
          <div>
            <div className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>{blogs.length}</div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>articles published</div>
          </div>
          <div>
            <div className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>{followers.length}</div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>followers</div>
          </div>
          <div>
            <div className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>{following.length}</div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>following</div>
          </div>
          {profile.createdAt && (
            <div>
              <div className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>
                {new Date(profile.createdAt).getFullYear()}
              </div>
              <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>member since</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick nav ────────────────────────────────────────────────────────── */}
      <div
        className="border-b border-line bg-bg-soft flex flex-wrap items-center"
        style={{ padding: '10px 24px', gap: 6 }}
      >
        <Link
          to={ROUTES.FOLLOWING}
          className="flex items-center gap-1.5 border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors"
          style={{ padding: '5px 12px', fontSize: 12, textDecoration: 'none' }}
        >
          <Users size={12} />
          Following · {following.length}
        </Link>
        <Link
          to={ROUTES.FOLLOWERS}
          className="flex items-center gap-1.5 border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors"
          style={{ padding: '5px 12px', fontSize: 12, textDecoration: 'none' }}
        >
          <Users size={12} />
          Followers · {followers.length}
        </Link>
        <Link
          to={ROUTES.MY_BLOGS}
          className="flex items-center gap-1.5 border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint hover:text-ink transition-colors"
          style={{ padding: '5px 12px', fontSize: 12, textDecoration: 'none' }}
        >
          <BookOpen size={12} />
          My blogs
        </Link>
      </div>

      {/* ── Published articles ───────────────────────────────────────────────── */}
      <div style={{ padding: '24px' }}>
        <div
          className="font-mono uppercase text-ink-3"
          style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 16 }}
        >
          Published articles · {blogs.length}
        </div>

        {blogs.length === 0 ? (
          <div
            className="rounded-[8px] border border-line border-dashed flex flex-col items-center justify-center text-center"
            style={{ padding: '48px 32px' }}
          >
            <div className="font-mono text-ink-3" style={{ fontSize: 22, marginBottom: 10 }}>✎</div>
            <p className="text-ink-2 font-medium" style={{ fontSize: 14 }}>No published articles yet.</p>
            <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
              Start writing and publish your first piece.
            </p>
            <Link
              to={ROUTES.EDITOR_NEW}
              className="mt-4 bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
              style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none' }}
            >
              + Write your first article
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={buildRoute.blog(blog.slug)}
                className="hover:bg-bg-soft transition-colors group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 18,
                  padding: '16px 0',
                  borderTop: '1px solid var(--ls-line-soft)',
                  textDecoration: 'none',
                }}
              >
                <div>
                  <span
                    className="font-mono rounded-[3px]"
                    style={{
                      fontSize: 10, padding: '2px 6px',
                      background: 'var(--ls-accent-soft)',
                      color: 'var(--ls-accent-ink)',
                    }}
                  >
                    {articleTypeLabel(blog.articleType)}
                  </span>
                  <h3
                    className="font-serif font-bold text-ink group-hover:text-ls-accent transition-colors"
                    style={{ fontSize: 17, marginTop: 8, lineHeight: 1.25 }}
                  >
                    {blog.title}
                  </h3>
                  {blog.summary && (
                    <p className="text-ink-2" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.55 }}>
                      {blog.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-ink-3" style={{ fontSize: 11, marginTop: 8 }}>
                    <span>{formatDateShort(blog.publishedAt ?? blog.createdAt)}</span>
                    {blog.readingTimeMinutes && (
                      <>
                        <span>·</span>
                        <span>{blog.readingTimeMinutes} min read</span>
                      </>
                    )}
                    {blog.likesCount > 0 && (
                      <>
                        <span>·</span>
                        <span>{blog.likesCount} likes</span>
                      </>
                    )}
                    {blog.savesCount > 0 && (
                      <>
                        <span>·</span>
                        <span>{blog.savesCount} saves</span>
                      </>
                    )}
                  </div>
                </div>
                {blog.coverImageUrl ? (
                  <img
                    src={blog.coverImageUrl}
                    alt={`Cover for ${blog.title}`}
                    className="rounded-[5px] object-cover flex-shrink-0"
                    style={{ width: 110, height: 82 }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="rounded-[5px] bg-bg-tint border border-line flex-shrink-0"
                    style={{ width: 110, height: 82 }}
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
