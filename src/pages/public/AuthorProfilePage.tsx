import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Twitter, Linkedin, Github, Globe, Check } from 'lucide-react'
import { useProfileByUsername, useAuthorBlogs } from '@/api/hooks/useProfileQueries'
import { useFollowProfile, useUnfollowProfile } from '@/api/hooks/useProfileMutations'
import { useAuthStore } from '@/store/authStore'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function AuthorProfilePage() {
  const { username = '' } = useParams()
  const { isAuthenticated } = useAuthStore()
  const { data: profile, isLoading: profileLoading } = useProfileByUsername(username)
  const { data: blogs, isLoading: blogsLoading } = useAuthorBlogs(username)

  const { mutate: followProfile, isPending: following } = useFollowProfile(username)
  const { mutate: unfollowProfile, isPending: unfollowing } = useUnfollowProfile(username)

  const [isFollowing, setIsFollowing] = useState(false)

  const articles = blogs ?? []
  const isLoading = profileLoading

  function handleFollow() {
    if (!isAuthenticated) { toast.error('Sign in to follow authors.'); return }
    if (!profile) return
    if (isFollowing) {
      unfollowProfile(profile.id, { onSuccess: () => setIsFollowing(false) })
    } else {
      followProfile(profile.id, { onSuccess: () => setIsFollowing(true) })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" style={{ gap: 12 }}>
        <p className="font-mono text-ink-3 uppercase" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Not found</p>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 28 }}>Author not found.</h1>
        <Link to="/" className="text-ls-accent underline underline-offset-2" style={{ fontSize: 13 }}>← Back to homepage</Link>
      </div>
    )
  }

  const authorInitials = initials(profile.displayName)

  return (
    <div className="flex flex-col">
      {/* Profile header */}
      <div
        className="border-b border-line px-4 sm:px-8 lg:px-12 flex flex-wrap gap-6"
        style={{ paddingTop: 32, paddingBottom: 24, alignItems: 'flex-start' }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 96, height: 96 }}
          />
        ) : (
          <div
            className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
            style={{ width: 96, height: 96, fontSize: 32 }}
          >
            {authorInitials}
          </div>
        )}

        <div className="flex-1">
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 30 }}>{profile.displayName}</h1>
          <div className="font-mono text-ink-3" style={{ fontSize: 12, marginTop: 2 }}>@{profile.username}</div>
          {profile.bio && (
            <p className="font-serif text-ink-2" style={{ marginTop: 8, maxWidth: 540, fontSize: 14 }}>
              {profile.bio}
            </p>
          )}
          {profile.expertiseTags && profile.expertiseTags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 6, marginTop: 10 }}>
              {profile.expertiseTags.map((tag: string) => (
                <span
                  key={tag}
                  className="border border-line text-ink-2 rounded-full"
                  style={{ padding: '3px 10px', fontSize: 12 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex" style={{ gap: 14, marginTop: 14, fontSize: 12, color: 'var(--ls-ink-2)' }}>
            {profile.twitterHandle && (
              <a href={`https://twitter.com/${profile.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-ink transition-colors" style={{ gap: 4 }}>
                <Twitter size={13} /> twitter
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-ink transition-colors" style={{ gap: 4 }}>
                <Linkedin size={13} /> linkedin
              </a>
            )}
            {profile.githubHandle && (
              <a href={`https://github.com/${profile.githubHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-ink transition-colors" style={{ gap: 4 }}>
                <Github size={13} /> github
              </a>
            )}
            {profile.websiteUrl && (
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-ink transition-colors" style={{ gap: 4 }}>
                <Globe size={13} /> website
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end" style={{ gap: 8 }}>
          <button
            onClick={handleFollow}
            disabled={following || unfollowing}
            className="font-medium rounded-[6px] transition-colors"
            style={{
              padding: '8px 16px', fontSize: 13,
              background: isFollowing ? 'transparent' : 'var(--ls-accent)',
              color: isFollowing ? 'var(--ls-ink-2)' : 'white',
              border: isFollowing ? '1px solid var(--ls-line)' : '1px solid transparent',
            }}
          >
            {isFollowing ? <><Check size={13} /> Following</> : '+ Follow'}
          </button>
        </div>
      </div>

      {/* Writing for strip */}
      <div
        className="border-b border-line bg-bg-soft flex flex-wrap items-center px-4 sm:px-8 lg:px-12 py-4"
        style={{ gap: 14 }}
      >
        <span className="font-mono uppercase text-ink-3 flex-shrink-0" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Writing for
        </span>
        <div className="flex" style={{ gap: 10 }}>
          <div className="rounded-[4px] border border-line bg-bg flex items-center" style={{ padding: '6px 10px', gap: 8 }}>
            <div
              className="rounded-[3px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2"
              style={{ width: 20, height: 20, fontSize: 9 }}
            >
              {authorInitials[0]}
            </div>
            <span className="font-semibold text-ink" style={{ fontSize: 12 }}>Independent</span>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="px-4 sm:px-8 lg:px-12 py-6">
        <div className="flex justify-between items-baseline" style={{ marginBottom: 14 }}>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 20 }}>
            Articles <span className="text-ink-3 font-normal">· {articles.length}</span>
          </h3>
        </div>

        {blogsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 200 }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
            <p className="text-ink-3" style={{ fontSize: 13 }}>No published articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            {articles.map((blog) => (
              <Link
                key={blog.id}
                to={buildRoute.blog(blog.slug)}
                className="rounded-[6px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors"
              >
                {blog.coverImageUrl ? (
                  <img
                    src={blog.coverImageUrl}
                    alt=""
                    style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div className="bg-bg-tint" style={{ height: 100 }} />
                )}
                <div style={{ padding: '10px 12px' }}>
                  <span
                    className="font-mono rounded-[3px]"
                    style={{ fontSize: 10, padding: '2px 5px', background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)' }}
                  >
                    {articleTypeLabel(blog.articleType)}
                  </span>
                  <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, marginTop: 6, lineHeight: 1.25 }}>
                    {blog.title}
                  </div>
                  <div className="text-ink-3" style={{ fontSize: 11, marginTop: 6 }}>
                    {formatDateShort(blog.publishedAt ?? blog.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
