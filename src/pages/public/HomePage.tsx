import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { useHome } from '@/api/hooks/useHomeQuery'
import { useStats } from '@/api/hooks/useStatsQuery'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort, initials } from '@/lib/utils'
import type { ArticleType } from '@/types/api'

const TYPE_PILLS: { label: string; value: ArticleType | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Engineering', value: 'engineering_blog' },
  { label: 'Architecture', value: 'architecture_deep_dive' },
  { label: 'Case study', value: 'case_study' },
  { label: 'Founder note', value: 'founder_note' },
  { label: 'Postmortem', value: 'failure_postmortem' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'AI experiment', value: 'ai_experiment' },
  { label: 'Opinion', value: 'opinion_essay' },
  { label: 'Open source', value: 'open_source_release' },
  { label: 'Project showcase', value: 'project_showcase' },
]

export function HomePage() {
  const { isAuthenticated, authorProfile } = useAuthStore()
  const [activeType, setActiveType] = useState<ArticleType | ''>('')

  // /home gives us featured article, trending, deep dives, and tags in one call
  const { data: homeData } = useHome()
  // /explore is only used when a type filter is active
  const { data: filteredBlogs } = useExplore(activeType ? { type: activeType } : undefined)
  const { data: stats } = useStats()

  const featuredArticle = homeData?.featuredArticle ?? null
  // When a type is active use the filtered results; otherwise use the home trending list
  const trendingArticles = activeType ? (filteredBlogs ?? []) : (homeData?.trendingArticles ?? [])
  const recentDeepDives = activeType ? (filteredBlogs ?? []).slice(0, 4) : (homeData?.recentDeepDives ?? [])
  const trendingTags = homeData?.trendingTags ?? []

  const STATS = [
    [stats?.articlesPublishedThisWeek?.toString() ?? '0', 'articles this week'],
    [stats?.avgReadCompletion != null ? `${Math.round(stats.avgReadCompletion * 100)}%` : '0%', 'avg read completion'],
    [stats?.companiesActivelyPublishing?.toString() ?? '0', 'companies publishing'],
    [stats?.newDeepDivesThisWeek?.toString() ?? '0', 'new deep dives this week'],
    [stats?.totalAuthors?.toLocaleString() ?? '0', 'writers on platform'],
  ]

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      {!isAuthenticated ? (
        <section className="border-b border-line px-4 sm:px-8 lg:px-14 pt-10 sm:pt-12 pb-8">
          <div className="grid gap-10 lg:gap-12 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' }}>
            <div>
              <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
                A home for engineering stories
              </span>
              <h1
                className="font-serif font-bold text-ink"
                style={{ fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.02, marginTop: 10, maxWidth: 580 }}
              >
                Long-form writing for the people who actually{' '}
                <em className="text-ls-accent not-italic">ship</em>.
              </h1>
              <p className="font-serif text-ink-2" style={{ fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.55, marginTop: 16, maxWidth: 520 }}>
                Engineering blogs, architecture deep-dives, post-mortems and build-in-public timelines — under your name or your company's.
              </p>
              <div className="flex flex-wrap" style={{ gap: 10, marginTop: 24 }}>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
                  style={{ padding: '10px 20px', fontSize: 14 }}
                >
                  Start writing — it's free
                </Link>
                <Link
                  to={ROUTES.EXPLORE}
                  className="border border-line text-ink font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '10px 20px', fontSize: 14 }}
                >
                  Explore articles
                </Link>
              </div>
              <div
                className="flex flex-wrap"
                style={{ gap: 24, marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--ls-line-soft)' }}
              >
                {STATS.map(([n, l]) => (
                  <div key={l}>
                    <div className="font-serif font-semibold text-ink" style={{ fontSize: 22 }}>{n}</div>
                    <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden sm:block">
              <div className="rounded-[8px] bg-bg-tint border border-line" style={{ height: 280 }} />
              {featuredArticle && (
                <Link
                  to={buildRoute.blog(featuredArticle.slug)}
                  className="absolute bg-bg border border-line rounded-[6px] shadow-sm hover:border-line-strong transition-colors"
                  style={{ bottom: -20, left: -16, right: 28, padding: 14 }}
                >
                  <span className="bg-ls-accent text-white font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                    This week's lead
                  </span>
                  <div className="font-serif font-semibold text-ink" style={{ fontSize: 17, marginTop: 8, lineHeight: 1.25 }}>
                    {featuredArticle.title}
                  </div>
                  <div className="text-ink-3 flex items-center" style={{ fontSize: 11, marginTop: 8, gap: 6 }}>
                    <div
                      className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2"
                      style={{ width: 16, height: 16, fontSize: 8 }}
                    >
                      {initials(featuredArticle.authorProfile?.displayName ?? featuredArticle.title)}
                    </div>
                    {featuredArticle.readingTimeMinutes ? `${featuredArticle.readingTimeMinutes} min read` : articleTypeLabel(featuredArticle.articleType)}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-line bg-bg-soft px-4 sm:px-8 lg:px-14 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Good morning</span>
              <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
                Welcome back, {authorProfile?.displayName ?? 'there'}.
              </h1>
            </div>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              <Link
                to={ROUTES.DRAFTS}
                className="border border-line text-ink-2 font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '8px 14px', fontSize: 13 }}
              >
                My drafts
              </Link>
              <Link
                to={ROUTES.DASHBOARD}
                className="border border-line text-ink-2 font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '8px 14px', fontSize: 13 }}
              >
                My dashboard
              </Link>
              <Link
                to={ROUTES.EDITOR_NEW}
                className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
                style={{ padding: '8px 14px', fontSize: 13 }}
              >
                + Write blog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BROWSE BY TYPE ── */}
      <section className="flex items-center px-4 sm:px-8 lg:px-14 pt-6" style={{ gap: 14, overflow: 'hidden' }}>
        <span className="font-mono uppercase text-ink-3 flex-shrink-0" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Browse
        </span>
        <div className="flex overflow-x-auto" style={{ gap: 6, flex: 1, scrollbarWidth: 'none' }}>
          {TYPE_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setActiveType(pill.value)}
              className={`flex-shrink-0 rounded-full border transition-colors font-sans ${
                activeType === pill.value
                  ? 'bg-ink text-bg border-ink'
                  : 'border-line text-ink-2 hover:border-line-strong hover:text-ink bg-bg'
              }`}
              style={{ padding: '4px 12px', fontSize: 12 }}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── TRENDING THIS WEEK ── */}
      <section className="px-4 sm:px-8 lg:px-14 pt-5 pb-8">
        <div className="flex items-baseline" style={{ gap: 14, marginBottom: 14 }}>
          <h2 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Trending this week</h2>
          <div className="flex-1 border-t border-line" />
          <Link to={ROUTES.EXPLORE} className="text-ls-accent underline underline-offset-2 flex-shrink-0" style={{ fontSize: 11 }}>
            See all →
          </Link>
        </div>

        {trendingArticles.length === 0 ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: i === 0 ? 320 : 180 }} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
            {/* Big feature card */}
            {trendingArticles[0] && (
              <Link
                to={buildRoute.blog(trendingArticles[0].slug)}
                className="rounded-[6px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors sm:row-span-2"
                style={{ gridRow: 'span 1' }}
              >
                <div className="bg-bg-tint flex-shrink-0" style={{ height: 200 }} />
                <div className="flex flex-col" style={{ padding: '18px 20px', gap: 8 }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="bg-ls-accent text-white font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                      {articleTypeLabel(trendingArticles[0].articleType)}
                    </span>
                    <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>#1 trending</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink" style={{ fontSize: 22, lineHeight: 1.15 }}>
                    {trendingArticles[0].title}
                  </h3>
                  {trendingArticles[0].summary && (
                    <p className="font-serif text-ink-2" style={{ fontSize: 14, lineHeight: 1.5 }}>
                      {trendingArticles[0].summary}
                    </p>
                  )}
                  <div className="flex items-center text-ink-2" style={{ gap: 10, marginTop: 6, fontSize: 12 }}>
                    <span>{formatDateShort(trendingArticles[0].publishedAt ?? trendingArticles[0].createdAt)}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining cards */}
            {trendingArticles.slice(1, 5).map((blog, i) => (
              <Link
                key={blog.id}
                to={buildRoute.blog(blog.slug)}
                className="rounded-[6px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors"
              >
                <div className="bg-bg-tint flex-shrink-0" style={{ height: 90 }} />
                <div className="flex flex-col" style={{ padding: '10px 12px', gap: 6 }}>
                  <div className="flex justify-between items-center">
                    <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                      {articleTypeLabel(blog.articleType)}
                    </span>
                    <span className="font-mono text-ink-3" style={{ fontSize: 10 }}>#{i + 2}</span>
                  </div>
                  <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, lineHeight: 1.25 }}>
                    {blog.title}
                  </div>
                  <div className="text-ink-3" style={{ fontSize: 11 }}>
                    {formatDateShort(blog.publishedAt ?? blog.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>


      {/* ── DEEP DIVES + RIGHT RAIL ── */}
      <section className="px-4 sm:px-8 lg:px-14 py-8 grid gap-8 lg:gap-9" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))' }}>
        {/* Recent deep dives */}
        <div>
          <div className="flex items-baseline" style={{ gap: 14, marginBottom: 14 }}>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Recent deep dives</h2>
            <div className="flex-1 border-t border-line" />
          </div>
          <div className="flex flex-col">
            {recentDeepDives.map((blog, i) => (
              <Link
                key={blog.id}
                to={buildRoute.blog(blog.slug)}
                className="hover:bg-bg-tint transition-colors"
                style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 12, padding: '12px 0', borderTop: '1px solid var(--ls-line-soft)', alignItems: 'center' }}
              >
                <span className="font-serif font-semibold text-ink-3" style={{ fontSize: 18 }}>0{i + 1}</span>
                <div>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="border border-line text-ink-2 rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                      {articleTypeLabel(blog.articleType)}
                    </span>
                    <span className="text-ink-3" style={{ fontSize: 11 }}>
                      {formatDateShort(blog.publishedAt ?? blog.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-ink" style={{ fontSize: 15, marginTop: 6, lineHeight: 1.3 }}>
                    {blog.title}
                  </h3>
                </div>
                <div className="bg-bg-tint rounded-[4px] flex-shrink-0 hidden sm:block" style={{ height: 60, width: 90 }} />
              </Link>
            ))}

            {recentDeepDives.length === 0 && (
              <div className="text-ink-3 text-center py-8" style={{ fontSize: 13 }}>No articles yet.</div>
            )}
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col" style={{ gap: 24 }}>
          {trendingTags.length > 0 && (
            <div>
              <div
                className="font-mono uppercase text-ink-3"
                style={{ fontSize: 10, letterSpacing: '1.2px', borderTop: '1px solid var(--ls-line-soft)', paddingTop: 10, marginBottom: 10 }}
              >
                Trending tags · this week
              </div>
              <div className="flex flex-wrap" style={{ gap: 6 }}>
                {trendingTags.slice(0, 12).map((tag) => (
                  <Link
                    key={tag.slug}
                    to={buildRoute.tag(tag.slug)}
                    className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors"
                    style={{ padding: '3px 10px', fontSize: 12 }}
                  >
                    #{tag.name}
                    {tag.blogCount != null && (
                      <span className="font-mono text-ink-3 ml-1" style={{ fontSize: 10 }}>· {tag.blogCount}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>


      {/* ── WRITER CTA (logged out only) ── */}
      {!isAuthenticated && (
        <section
          className="text-bg px-4 sm:px-8 lg:px-14 py-10 sm:py-12"
          style={{ background: 'var(--ls-ink)' }}
        >
          <div className="grid gap-8 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
            <div>
              <span className="font-mono uppercase text-ls-accent" style={{ fontSize: 10, letterSpacing: 1.2 }}>
                For writers
              </span>
              <h2 className="font-serif font-bold" style={{ fontSize: 'clamp(22px, 3vw, 30px)', color: 'var(--ls-bg)', marginTop: 8, maxWidth: 580 }}>
                Publish under your name, your company, or both. We handle the SEO, the OG images, and the build-in-public timeline.
              </h2>
              <ul className="flex flex-wrap" style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', gap: '8px 24px', fontSize: 13, opacity: 0.85 }}>
                <li>— Auto-generated tag pages</li>
                <li>— Per-blog analytics</li>
                <li>— Scheduled publishing</li>
                <li>— No ads, ever</li>
              </ul>
            </div>
            <div className="flex flex-col sm:items-end" style={{ gap: 10 }}>
              <Link
                to={ROUTES.REGISTER}
                className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors text-center"
                style={{ padding: '12px 24px', fontSize: 14 }}
              >
                Create your account
              </Link>
              <button
                className="border text-bg rounded-[6px] transition-colors text-center"
                style={{ padding: '12px 24px', fontSize: 14, borderColor: 'var(--ls-bg)', background: 'transparent' }}
              >
                Read the writer guide
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
