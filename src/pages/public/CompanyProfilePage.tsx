import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCompanyByHandle, useCompanyMembers, useCompanyMilestones } from '@/api/hooks/useCompanyQueries'
import { useCompanyBlogs } from '@/api/hooks/useBlogQueries'
import { useFollowCompany, useUnfollowCompany } from '@/api/hooks/useCompanyMutations'
import { useFollowingCompanies } from '@/api/hooks/useFollowingQueries'
import { useAuthStore } from '@/store/authStore'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDate, formatDateShort, initials } from '@/lib/utils'
import { Spinner } from '@/shared/components/feedback/Spinner'

type Tab = 'overview' | 'blogs' | 'team' | 'timeline'
type SortOption = 'newest' | 'oldest'

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
  const { isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [articleTypeFilter, setArticleTypeFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortOption>('newest')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const { data: company, isLoading } = useCompanyByHandle(handle)
  const { data: blogs } = useCompanyBlogs(handle)
  const { data: members } = useCompanyMembers(handle)
  const { data: milestones } = useCompanyMilestones(handle)

  const { data: followingCompanies } = useFollowingCompanies()
  const { mutate: followCompany, isPending: following } = useFollowCompany(handle)
  const { mutate: unfollowCompany, isPending: unfollowing } = useUnfollowCompany(handle)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (followingCompanies !== undefined && company) {
      setIsFollowing(followingCompanies.some((c) => c.id === company.id))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followingCompanies, company])

  // Close lightbox on Escape
  useEffect(() => {
    if (lightboxIdx === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => Math.max(0, (i ?? 1) - 1))
      if (e.key === 'ArrowRight') {
        const max = (company?.galleryImages?.length ?? 1) - 1
        setLightboxIdx((i) => Math.min(max, (i ?? 0) + 1))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx, company?.galleryImages?.length])

  function handleFollow() {
    if (!isAuthenticated) { toast.error('Sign in to follow companies.'); return }
    if (!company) return
    if (isFollowing) {
      setIsFollowing(false)
      unfollowCompany(company.id, { onError: () => setIsFollowing(true) })
    } else {
      setIsFollowing(true)
      followCompany(company.id, { onError: () => setIsFollowing(false) })
    }
  }

  const allArticles = blogs ?? []
  const team = members ?? []
  const timeline = milestones ?? []
  const gallery = company?.galleryImages ?? []

  const articleTypes = useMemo(() => {
    const types = new Set(allArticles.map((b) => b.articleType).filter(Boolean))
    return Array.from(types) as string[]
  }, [allArticles])

  const articles = useMemo(() => {
    let list = articleTypeFilter === 'all'
      ? allArticles
      : allArticles.filter((b) => b.articleType === articleTypeFilter)
    list = [...list].sort((a, b) => {
      const aDate = new Date(a.publishedAt ?? a.createdAt).getTime()
      const bDate = new Date(b.publishedAt ?? b.createdAt).getTime()
      return sort === 'newest' ? bDate - aDate : aDate - bDate
    })
    return list
  }, [allArticles, articleTypeFilter, sort])

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
      {/* ── Banner ──────────────────────────────────────────────────────────── */}
      <div
        className="border-b border-line px-4 sm:px-8 lg:px-12 flex flex-wrap gap-5"
        style={{ paddingTop: 32, paddingBottom: 24, alignItems: 'flex-start' }}
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

        <div className="flex-1 min-w-0">
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Company</span>
          <h1 className="font-serif font-bold text-ink" style={{ fontSize: 34, marginTop: 6 }}>{company.name}</h1>
          <p className="font-serif text-ink-2" style={{ maxWidth: 540, marginTop: 8, fontSize: 15 }}>
            {company.tagline}
          </p>

          {/* Tags: industry + tech stack */}
          <div className="flex flex-wrap" style={{ gap: 8, marginTop: 12 }}>
            {company.industry && (
              <span className="bg-ls-accent text-white font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                {company.industry}
              </span>
            )}
            {company.techStack.map((tech) => (
              <Link
                key={tech}
                to={buildRoute.tag(tech)}
                className="text-ink-3 hover:text-ink transition-colors"
                style={{ fontSize: 12, textDecoration: 'none' }}
              >
                #{tech}
              </Link>
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
            {isFollowing ? 'Unfollow' : '+ Follow'}
          </button>
          <div className="text-ink-3" style={{ fontSize: 11 }}>
            {allArticles.length} posts · {team.length} team
          </div>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-line px-4 sm:px-8 lg:px-12" style={{ gap: 24 }}>
        {([
          { key: 'overview',  label: 'Overview' },
          { key: 'blogs',     label: `Blogs · ${allArticles.length}` },
          { key: 'team',      label: `Team · ${team.length}` },
          { key: 'timeline',  label: `Timeline · ${timeline.length}` },
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
              background: 'none', border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview tab ────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="px-4 sm:px-8 lg:px-12 py-8" style={{ maxWidth: 820 }}>
          {/* About */}
          <div style={{ marginBottom: 32 }}>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}>
              About
            </div>
            <p className="font-serif text-ink" style={{ fontSize: 16, lineHeight: 1.7 }}>
              {company.tagline}
            </p>
            <div className="flex" style={{ gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
              {company.websiteUrl && (
                <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-ink-3 hover:text-ink transition-colors" style={{ fontSize: 12 }}>
                  ↗ {company.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              )}
              {company.stage && (
                <span className="font-mono text-ink-3" style={{ fontSize: 12 }}>Stage: {company.stage}</span>
              )}
            </div>
          </div>

          {/* Tech stack */}
          {company.techStack.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}>
                Tech stack
              </div>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {company.techStack.map((tech) => (
                  <Link
                    key={tech}
                    to={buildRoute.tag(tech)}
                    className="text-ink hover:text-ls-accent transition-colors"
                    style={{ fontSize: 14, textDecoration: 'none', fontWeight: 500 }}
                  >
                    #{tech}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}>
                Gallery
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                {gallery.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    onClick={() => setLightboxIdx(i)}
                    className="rounded-[8px] object-cover border border-line"
                    style={{ width: '100%', height: 130, cursor: 'pointer', transition: 'opacity 0.15s' }}
                    onMouseEnter={(e) => { (e.target as HTMLImageElement).style.opacity = '0.85' }}
                    onMouseLeave={(e) => { (e.target as HTMLImageElement).style.opacity = '1' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Blogs tab ───────────────────────────────────────────────────────── */}
      {activeTab === 'blogs' && (
        <div className="px-4 sm:px-8 lg:px-12 py-6">
          {/* Filter + sort bar */}
          {allArticles.length > 0 && (
            <div className="flex items-center justify-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div className="flex" style={{ gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setArticleTypeFilter('all')}
                  className="rounded-full font-mono transition-colors"
                  style={{
                    fontSize: 11, padding: '4px 12px',
                    background: articleTypeFilter === 'all' ? 'var(--ls-ink)' : 'transparent',
                    color: articleTypeFilter === 'all' ? 'var(--ls-bg)' : 'var(--ls-ink-3)',
                    border: articleTypeFilter === 'all' ? '1px solid var(--ls-ink)' : '1px solid var(--ls-line)',
                  }}
                >
                  All
                </button>
                {articleTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setArticleTypeFilter(type)}
                    className="rounded-full font-mono transition-colors"
                    style={{
                      fontSize: 11, padding: '4px 12px',
                      background: articleTypeFilter === type ? 'var(--ls-ink)' : 'transparent',
                      color: articleTypeFilter === type ? 'var(--ls-bg)' : 'var(--ls-ink-3)',
                      border: articleTypeFilter === type ? '1px solid var(--ls-ink)' : '1px solid var(--ls-line)',
                    }}
                  >
                    {articleTypeLabel(type)}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="border border-line rounded-[4px] bg-bg text-ink-2"
                style={{ fontSize: 12, padding: '5px 10px', cursor: 'pointer' }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          )}

          {articles.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>
                {articleTypeFilter === 'all' ? 'No published articles yet.' : `No ${articleTypeLabel(articleTypeFilter)} articles yet.`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col" style={{ maxWidth: 680 }}>
              {articles.map((blog) => (
                <Link
                  key={blog.id}
                  to={buildRoute.blog(blog.slug)}
                  className="hover:bg-bg-tint transition-colors"
                  style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, padding: '18px 0', borderTop: '1px solid var(--ls-line-soft)' }}
                >
                  <div>
                    <span
                      className="font-mono rounded-[3px]"
                      style={{ fontSize: 10, padding: '2px 6px', background: 'var(--ls-accent-soft)', color: 'var(--ls-accent-ink)' }}
                    >
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
                  {blog.coverImageUrl ? (
                    <img
                      src={blog.coverImageUrl}
                      alt=""
                      className="rounded-[4px] object-cover flex-shrink-0"
                      style={{ width: 160, height: 110 }}
                    />
                  ) : (
                    <div className="rounded-[4px] bg-bg-tint border border-line flex-shrink-0" style={{ width: 160, height: 110 }} />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Team tab ────────────────────────────────────────────────────────── */}
      {activeTab === 'team' && (
        <div className="px-4 sm:px-8 lg:px-12 py-6">
          {team.length === 0 ? (
            <div className="rounded-[6px] border border-line flex items-center justify-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No team members to show.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
              {team.map((member) => (
                <div key={member.id} className="rounded-[6px] border border-line flex items-center" style={{ padding: '12px 14px', gap: 12 }}>
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt="" className="rounded-full object-cover flex-shrink-0" style={{ width: 40, height: 40 }} />
                  ) : (
                    <div
                      className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
                      style={{ width: 40, height: 40, fontSize: 14 }}
                    >
                      {initials(member.displayName)}
                    </div>
                  )}
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

      {/* ── Timeline tab ────────────────────────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="px-4 sm:px-8 lg:px-12 py-6" style={{ maxWidth: 680 }}>
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

      {/* ── Gallery lightbox ────────────────────────────────────────────────── */}
      {lightboxIdx !== null && gallery.length > 0 && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setLightboxIdx(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 99,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>

          {/* Prev */}
          {lightboxIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => Math.max(0, (i ?? 1) - 1)) }}
              style={{
                position: 'absolute', left: 20,
                background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 99,
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer',
              }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <img
            src={gallery[lightboxIdx]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '88vw', maxHeight: '88vh',
              borderRadius: 10, objectFit: 'contain',
              boxShadow: '0 32px 80px rgba(0,0,0,.5)',
            }}
          />

          {/* Next */}
          {lightboxIdx < gallery.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => Math.min(gallery.length - 1, (i ?? 0) + 1)) }}
              style={{
                position: 'absolute', right: 20,
                background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 99,
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer',
              }}
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: 20,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12, color: 'rgba(255,255,255,.5)',
          }}>
            {lightboxIdx + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  )
}
