import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Tag as TagIcon, Building2, UserMinus } from 'lucide-react'
import { useFollowingAuthors, useFollowingTags, useFollowingCompanies } from '@/api/hooks/useFollowingQueries'
import { useUnfollowProfile } from '@/api/hooks/useProfileMutations'
import { useUnfollowTag } from '@/api/hooks/useTagMutations'
import { buildRoute } from '@/constants/routes'
import { initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'

type Tab = 'authors' | 'companies' | 'tags'

export function FollowingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('authors')
  const qc = useQueryClient()

  const { data: authors, isLoading: authorsLoading } = useFollowingAuthors()
  const { data: tags, isLoading: tagsLoading } = useFollowingTags()
  const { data: companies, isLoading: companiesLoading } = useFollowingCompanies()

  const { mutate: unfollowAuthor } = useUnfollowProfile('')
  const { mutate: unfollowTag } = useUnfollowTag()

  function handleUnfollowAuthor(profileId: string) {
    unfollowAuthor(profileId, {
      onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.FOLLOWING.AUTHORS }),
    })
  }

  function handleUnfollowTag(tagId: string) {
    unfollowTag(tagId, {
      onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.FOLLOWING.TAGS }),
    })
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number | undefined }[] = [
    { key: 'authors', label: 'Authors', icon: <Users size={13} />, count: authors?.length },
    { key: 'companies', label: 'Companies', icon: <Building2 size={13} />, count: companies?.length },
    { key: 'tags', label: 'Tags', icon: <TagIcon size={13} />, count: tags?.length },
  ]

  const isLoading = activeTab === 'authors' ? authorsLoading : activeTab === 'companies' ? companiesLoading : tagsLoading

  return (
    <div className="flex flex-col bg-bg min-h-full -m-4 lg:-m-6 p-4 lg:p-6">
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26 }}>Following</h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>People, companies, and topics you follow</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line" style={{ gap: 2, marginBottom: 24 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center font-sans transition-colors"
            style={{
              gap: 6,
              padding: '9px 14px',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
              borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.count != null && (
              <span
                className={`rounded-full font-mono ${activeTab === tab.key ? 'bg-ink text-bg' : 'bg-bg-tint text-ink-3'}`}
                style={{ fontSize: 10, padding: '1px 6px' }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center" style={{ paddingTop: 48 }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Authors tab */}
          {activeTab === 'authors' && (
            <div className="flex flex-col" style={{ gap: 12 }}>
              {(authors ?? []).length === 0 ? (
                <EmptyState icon={<Users size={24} />} title="Not following anyone yet" subtitle="Follow authors to see their articles in your feed." />
              ) : (
                (authors ?? []).map((author) => (
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
                      {author.expertiseTags.length > 0 && (
                        <div className="flex flex-wrap" style={{ gap: 4, marginTop: 5 }}>
                          {author.expertiseTags.slice(0, 3).map((tag) => (
                            <span key={tag} className="border border-line text-ink-3 rounded-full font-mono" style={{ padding: '1px 7px', fontSize: 10 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleUnfollowAuthor(author.id)}
                      className="flex items-center border border-line text-ink-3 rounded-[6px] hover:border-red-300 hover:text-red-500 transition-colors flex-shrink-0"
                      style={{ gap: 5, padding: '6px 11px', fontSize: 12 }}
                    >
                      <UserMinus size={12} />
                      Unfollow
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Companies tab */}
          {activeTab === 'companies' && (
            <div className="flex flex-col" style={{ gap: 12 }}>
              {(companies ?? []).length === 0 ? (
                <EmptyState icon={<Building2 size={24} />} title="Not following any companies" subtitle="Follow companies to see their engineering blogs." />
              ) : (
                (companies ?? []).map((company) => (
                  <div key={company.id} className="rounded-[8px] border border-line flex items-center" style={{ padding: '14px 16px', gap: 14 }}>
                    <Link to={buildRoute.company(company.handle)} className="flex-shrink-0">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="rounded-[6px] object-cover" style={{ width: 44, height: 44 }} />
                      ) : (
                        <div className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2" style={{ width: 44, height: 44, fontSize: 15 }}>
                          {initials(company.name)}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={buildRoute.company(company.handle)} className="font-semibold text-ink hover:text-ls-accent transition-colors" style={{ fontSize: 14 }}>
                        {company.name}
                      </Link>
                      <div className="font-mono text-ink-3" style={{ fontSize: 11 }}>@{company.handle}</div>
                      {company.tagline && (
                        <p className="text-ink-2 line-clamp-1" style={{ fontSize: 12, marginTop: 3 }}>{company.tagline}</p>
                      )}
                    </div>
                    <Link
                      to={buildRoute.company(company.handle)}
                      className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors flex-shrink-0"
                      style={{ padding: '6px 11px', fontSize: 12 }}
                    >
                      View →
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tags tab */}
          {activeTab === 'tags' && (
            <div>
              {(tags ?? []).length === 0 ? (
                <EmptyState icon={<TagIcon size={24} />} title="Not following any tags" subtitle="Follow tags to discover articles on topics you care about." />
              ) : (
                <div className="flex flex-wrap" style={{ gap: 10 }}>
                  {(tags ?? []).map((tag) => (
                    <div key={tag.id} className="flex items-center rounded-full border border-line" style={{ gap: 0, overflow: 'hidden' }}>
                      <Link
                        to={buildRoute.tag(tag.slug)}
                        className="flex items-center text-ink-2 hover:text-ink transition-colors"
                        style={{ gap: 5, padding: '6px 12px', fontSize: 13 }}
                      >
                        <TagIcon size={11} className="text-ink-3" />
                        {tag.name}
                        {tag.blogCount > 0 && (
                          <span className="font-mono text-ink-3" style={{ fontSize: 10 }}>· {tag.blogCount}</span>
                        )}
                      </Link>
                      <button
                        onClick={() => handleUnfollowTag(tag.id)}
                        className="border-l border-line text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                        title="Unfollow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-[8px] border border-line" style={{ padding: '52px 32px', gap: 10 }}>
      <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center text-ink-3" style={{ width: 52, height: 52 }}>
        {icon}
      </div>
      <h3 className="font-serif font-bold text-ink" style={{ fontSize: 17 }}>{title}</h3>
      <p className="text-ink-3" style={{ maxWidth: 320, fontSize: 13, lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  )
}
