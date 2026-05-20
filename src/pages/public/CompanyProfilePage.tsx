import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCompanyByHandle, useCompanyMembers, useCompanyMilestones } from '@/api/hooks/useCompanyQueries'
import { useCompanyBlogs } from '@/api/hooks/useBlogQueries'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate, formatDateShort, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

type Tab = 'blogs' | 'team' | 'timeline'

const MILESTONE_TYPE_LABELS: Record<string, string> = {
  launch: 'LAUNCH',
  user_milestone: 'MILESTONE',
  infra_update: 'INFRA',
  funding: 'FUNDING',
  feature_release: 'FEATURE',
  bug_fixed: 'BUG FIX',
  partnership: 'PARTNERSHIP',
  hiring: 'HIRING',
  experiment: 'EXPERIMENT',
  other: 'OTHER',
}

export function CompanyProfilePage() {
  const { handle = '' } = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('blogs')

  const { data: company, isLoading } = useCompanyByHandle(handle)
  const { data: blogs } = useCompanyBlogs(handle)
  const { data: members } = useCompanyMembers(handle)
  const { data: milestones } = useCompanyMilestones(handle)

  const articles = blogs ?? []
  const team = members ?? []
  const timeline = milestones ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" style={{ gap: 12 }}>
        <p className="font-mono text-ink-3 uppercase" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Not found</p>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 28 }}>Company not found.</h1>
        <Link to="/" className="text-ls-accent underline underline-offset-2" style={{ fontSize: 13 }}>← Back to homepage</Link>
      </div>
    )
  }

  const companyInitials = initials(company.name)

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div
        className="border-b border-line"
        style={{ padding: '40px 48px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20, alignItems: 'flex-start' }}
      >
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="rounded-[8px] object-cover flex-shrink-0"
            style={{ width: 88, height: 88 }}
          />
        ) : (
          <div
            className="rounded-[8px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2 flex-shrink-0"
            style={{ width: 88, height: 88, fontSize: 32 }}
          >
            {companyInitials}
          </div>
        )}

        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Company</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 34, marginTop: 6 }}>{company.name}</h1>
          <p className="font-serif text-ink-2" style={{ maxWidth: 540, marginTop: 8, fontSize: 15 }}>
            {company.tagline}
          </p>
          <div className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }}>
            {company.industry && (
              <span className="bg-ls-accent text-white font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                {company.industry}
              </span>
            )}
            {company.techStack.map((tech) => (
              <span
                key={tech}
                className="border border-line text-ink-2 rounded-full"
                style={{ padding: '3px 10px', fontSize: 12 }}
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex" style={{ gap: 14, marginTop: 14, fontSize: 12, color: 'var(--ls-ink-2)' }}>
            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-mono hover:text-ink transition-colors">
                ↗ {company.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            )}
            {company.founderSocialLink && (
              <a href={company.founderSocialLink} target="_blank" rel="noopener noreferrer" className="font-mono hover:text-ink transition-colors">
                ↗ founder
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end" style={{ gap: 8 }}>
          <button
            className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            + Follow
          </button>
          <div className="text-ink-3" style={{ fontSize: 11 }}>
            {articles.length} posts · {team.length} team
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-line" style={{ gap: 24, padding: '0 48px' }}>
        {([
          { key: 'blogs', label: `Blogs · ${articles.length}` },
          { key: 'team', label: `Team · ${team.length}` },
          { key: 'timeline', label: `Timeline · ${timeline.length}` },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-sans transition-colors"
            style={{
              padding: '14px 0',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
              borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'blogs' && (
        <div style={{ padding: '24px 48px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
          <div>
            {articles.length === 0 ? (
              <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
                <p className="text-ink-3" style={{ fontSize: 13 }}>No published articles yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {articles.map((blog) => (
                  <Link
                    key={blog.id}
                    to={buildRoute.blog(blog.slug)}
                    className="hover:bg-bg-tint transition-colors"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 18, padding: '18px 0', borderTop: '1px solid var(--ls-line-soft)' }}
                  >
                    <div>
                      <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                        {articleTypeLabel(blog.articleType)}
                      </span>
                      <h3 className="font-serif font-bold text-ink" style={{ fontSize: 22, marginTop: 8 }}>
                        {blog.title}
                      </h3>
                      {blog.summary && (
                        <p className="font-serif text-ink-2" style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.5, maxWidth: 500 }}>
                          {blog.summary}
                        </p>
                      )}
                      <div className="flex items-center text-ink-3" style={{ gap: 8, marginTop: 10, fontSize: 11 }}>
                        {formatDateShort(blog.publishedAt ?? blog.createdAt)}
                      </div>
                    </div>
                    <div className="rounded-[4px] bg-bg-tint border border-line" style={{ height: 120 }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="flex flex-col" style={{ gap: 18 }}>
            <div>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>
                The team
              </div>
              <div className="rounded-[6px] border border-line" style={{ padding: '10px 12px' }}>
                <div className="flex flex-col" style={{ gap: 8 }}>
                  {team.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center" style={{ gap: 8 }}>
                      <div
                        className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
                        style={{ width: 26, height: 26, fontSize: 10 }}
                      >
                        {initials(member.displayName)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-ink" style={{ fontSize: 12 }}>{member.displayName}</div>
                        <div className="text-ink-3 capitalize" style={{ fontSize: 10 }}>{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {team.length > 4 && (
                  <button
                    onClick={() => setActiveTab('team')}
                    className="text-ls-accent underline underline-offset-2 w-full text-center"
                    style={{ fontSize: 11, marginTop: 8 }}
                  >
                    See all {team.length} →
                  </button>
                )}
              </div>
            </div>

            {timeline.length > 0 && (
              <div>
                <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>
                  Recent milestones
                </div>
                <div className="rounded-[6px] border border-line" style={{ padding: '10px 12px' }}>
                  <div className="flex flex-col" style={{ gap: 10 }}>
                    {timeline.slice(0, 3).map((m) => (
                      <div key={m.id} className="flex" style={{ gap: 8 }}>
                        <span
                          className="flex-shrink-0 rounded-full bg-ls-accent"
                          style={{ width: 8, height: 8, marginTop: 6 }}
                        />
                        <div className="flex-1">
                          <span className="font-mono text-ink-3" style={{ fontSize: 10 }}>
                            {MILESTONE_TYPE_LABELS[m.type] ?? m.type.toUpperCase()}
                          </span>
                          <div className="font-serif font-semibold text-ink" style={{ fontSize: 12 }}>{m.headline}</div>
                          <div className="text-ink-3" style={{ fontSize: 10 }}>{formatDateShort(m.milestoneDate)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {timeline.length > 3 && (
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className="text-ls-accent underline underline-offset-2 w-full text-center"
                      style={{ fontSize: 11, marginTop: 8 }}
                    >
                      View full timeline →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div style={{ padding: '24px 48px' }}>
          {team.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No team members to show.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {team.map((member) => (
                <div key={member.id} className="rounded-[6px] border border-line flex items-center" style={{ padding: '12px 14px', gap: 12 }}>
                  <div
                    className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
                    style={{ width: 40, height: 40, fontSize: 14 }}
                  >
                    {initials(member.displayName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink truncate" style={{ fontSize: 13 }}>{member.displayName}</div>
                    <div className="font-mono text-ink-3" style={{ fontSize: 11 }}>@{member.username}</div>
                    <span
                      className={`inline-block rounded-[3px] font-mono mt-1 ${
                        member.role === 'owner' ? 'bg-ls-accent text-white' : 'border border-line text-ink-2'
                      }`}
                      style={{ fontSize: 10, padding: '1px 5px' }}
                    >
                      {member.role === 'owner' ? 'Owner' : 'Author'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div style={{ padding: '24px 48px', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 40, position: 'relative' }}>
          <div style={{ position: 'sticky', top: 0, height: 'fit-content' }}>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}>
              Jump to
            </div>
            <div className="text-ink-2" style={{ fontSize: 12 }}>
              {timeline.length === 0 ? 'No milestones yet' : `${timeline.length} milestones`}
            </div>
          </div>

          <div className="border-l border-line relative" style={{ paddingLeft: 24 }}>
            {timeline.length === 0 ? (
              <p className="text-ink-3" style={{ fontSize: 13 }}>No milestones added yet.</p>
            ) : (
              <div className="flex flex-col" style={{ gap: 18 }}>
                {timeline.map((m) => (
                  <div key={m.id} style={{ position: 'relative' }}>
                    <span
                      className="absolute border border-ls-accent rounded-full bg-bg"
                      style={{ left: -31, top: 6, width: 12, height: 12 }}
                    />
                    <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                      <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 5px' }}>
                        {MILESTONE_TYPE_LABELS[m.type] ?? m.type.toUpperCase()}
                      </span>
                      <span className="text-ink-3" style={{ fontSize: 11 }}>{formatDate(m.milestoneDate)}</span>
                    </div>
                    <h3 className="font-serif font-bold text-ink" style={{ fontSize: 17 }}>{m.headline}</h3>
                    {m.description && (
                      <p className="font-serif text-ink-2" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.55, maxWidth: 560 }}>
                        {m.description}
                      </p>
                    )}
                    {m.impactMetric && (
                      <span
                        className="inline-block bg-ls-accent/10 text-ls-accent rounded-full border border-ls-accent/20"
                        style={{ fontSize: 11, padding: '2px 8px', marginTop: 8 }}
                      >
                        {m.impactMetric}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
