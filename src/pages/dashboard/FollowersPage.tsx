import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useFollowerAuthors } from '@/api/hooks/useFollowersQueries'
import { buildRoute } from '@/constants/routes'
import { initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function FollowersPage() {
  const { data: authors, isLoading } = useFollowerAuthors()

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      <div style={{ marginBottom: 24 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Your audience</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
          Followers
          {authors && (
            <span className="text-ink-3 font-normal" style={{ fontSize: 18 }}> · {authors.length}</span>
          )}
        </h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
          People who follow you on Lorestack
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center" style={{ paddingTop: 48 }}>
          <Spinner size="lg" />
        </div>
      ) : (authors ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center rounded-[8px] border border-line" style={{ padding: '52px 32px', gap: 10 }}>
          <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center text-ink-3" style={{ width: 52, height: 52 }}>
            <Users size={24} />
          </div>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 17 }}>No followers yet</h3>
          <p className="text-ink-3" style={{ maxWidth: 320, fontSize: 13, lineHeight: 1.6 }}>
            When people follow you, they'll appear here. Keep publishing great content!
          </p>
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 12 }}>
          {(authors ?? []).map((author) => (
            <div key={author.id} className="rounded-[8px] border border-line flex items-center" style={{ padding: '14px 16px', gap: 14 }}>
              <Link to={buildRoute.author(author.username)} className="flex-shrink-0">
                {author.avatarUrl ? (
                  <img src={author.avatarUrl} alt={author.displayName} className="rounded-full object-cover" style={{ width: 44, height: 44 }} />
                ) : (
                  <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2" style={{ width: 44, height: 44, fontSize: 15 }}>
                    {initials(author.displayName)}
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={buildRoute.author(author.username)} className="font-semibold text-ink hover:text-ls-accent transition-colors" style={{ fontSize: 14 }}>
                  {author.displayName}
                </Link>
                <div className="font-mono text-ink-3" style={{ fontSize: 11 }}>@{author.username}</div>
                {author.bio && (
                  <p className="text-ink-2 line-clamp-1" style={{ fontSize: 12, marginTop: 3 }}>{author.bio}</p>
                )}
                {author.expertiseTags && author.expertiseTags.length > 0 && (
                  <div className="flex flex-wrap" style={{ gap: 4, marginTop: 5 }}>
                    {author.expertiseTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="border border-line text-ink-3 rounded-full font-mono" style={{ padding: '1px 7px', fontSize: 10 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to={buildRoute.author(author.username)}
                className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors flex-shrink-0"
                style={{ padding: '6px 11px', fontSize: 12 }}
              >
                View profile →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
