import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Heart, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { useHome } from '@/api/hooks/useHomeQuery'
import { useStats } from '@/api/hooks/useStatsQuery'
import { ROUTES, buildRoute } from '@/constants/routes'
import { articleTypeLabel, cn, formatDateShort, timeGreeting } from '@/lib/utils'
import { BlogFeedCard } from '@/shared/components/cards/BlogFeedCard'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'
import { ArticleTypeBadge } from '@/shared/components/ui/ArticleTypeBadge'
import { ARTICLE_TYPE_FILTERS } from '@/constants/articleTypes'
import type { ArticleType } from '@/types/api'

export function HomePage() {
  const { isAuthenticated, authorProfile } = useAuthStore()
  const [activeType, setActiveType] = useState<ArticleType | ''>('')

  const { data: homeData, isLoading: homeLoading, isError: homeError } = useHome()
  const { data: filteredBlogs } = useExplore(activeType ? { type: activeType } : undefined)
  const { data: stats } = useStats()

  const featuredArticle = homeData?.featuredArticle ?? null
  const trendingArticles = activeType ? (filteredBlogs ?? []) : (homeData?.trendingArticles ?? [])
  const recentDeepDives = activeType ? (filteredBlogs ?? []).slice(0, 4) : (homeData?.recentDeepDives ?? [])
  const trendingTags = homeData?.trendingTags ?? []
  const isTrendingLoading = homeLoading && trendingArticles.length === 0

  const STATS = [
    [stats?.articlesPublishedThisWeek?.toString() ?? '–', 'articles this week'],
    [stats?.totalAuthors?.toLocaleString() ?? '–', 'writers on platform'],
    [stats?.companiesActivelyPublishing?.toString() ?? '–', 'companies publishing'],
    [stats?.newDeepDivesThisWeek?.toString() ?? '–', 'deep dives this week'],
  ]

  return (
    <div className="flex flex-col">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      {!isAuthenticated ? (
        <section className="border-b border-line px-4 sm:px-8 lg:px-12" style={{ paddingTop: 48, paddingBottom: 40 }}>
          <div
            className="grid items-center"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1.4fr))', gap: 'clamp(32px, 5vw, 64px)' }}
          >
            {/* Left — copy */}
            <div>
              <span className="font-mono uppercase text-ls-accent" style={{ fontSize: 10, letterSpacing: '1.6px' }}>
                A home for engineering stories
              </span>
              <h1
                className="font-serif font-bold text-ink"
                style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', lineHeight: 1.0, marginTop: 10, maxWidth: 560 }}
              >
                Long-form writing for the people who actually{' '}
                <em className="not-italic text-ls-accent">ship</em>.
              </h1>
              <p className="font-serif text-ink-2" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: 1.6, marginTop: 16, maxWidth: 500 }}>
                Engineering blogs, architecture deep-dives, post-mortems and build-in-public timelines — under your name or your company's.
              </p>
              <div className="flex flex-wrap" style={{ gap: 10, marginTop: 24 }}>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-ls-accent text-white font-semibold rounded-[6px] hover:bg-accent-ink transition-colors"
                  style={{ padding: '10px 22px', fontSize: 13.5 }}
                >
                  Start writing — it's free
                </Link>
                <Link
                  to={ROUTES.EXPLORE}
                  className="border border-line text-ink font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '10px 22px', fontSize: 13.5 }}
                >
                  Explore articles
                </Link>
              </div>

              {/* Stat strip */}
              <div
                className="flex flex-wrap"
                style={{ gap: '12px 36px', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--ls-line-soft)' }}
              >
                {STATS.map(([n, l]) => (
                  <div key={l}>
                    <div className="font-serif font-semibold text-ink" style={{ fontSize: 20 }}>{n}</div>
                    <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — featured article card */}
            <div className="relative hidden sm:block" style={{ paddingBottom: 32 }}>
              <div
                className="rounded-[10px] overflow-hidden border border-line"
                style={{ height: 280, background: 'var(--ls-bg-tint)' }}
              >
                {featuredArticle?.coverImageUrl ? (
                  <img
                    src={featuredArticle.coverImageUrl}
                    alt={`Cover for ${featuredArticle.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-soft" />
                )}
              </div>
              {featuredArticle && (
                <Link
                  to={buildRoute.blog(featuredArticle.slug)}
                  className="absolute bg-bg border border-line rounded-[8px] hover:border-line-strong hover:shadow-lg transition-all"
                  style={{ bottom: 0, left: -12, right: 20, padding: '14px 16px', boxShadow: '0 6px 24px rgba(0,0,0,.10)' }}
                >
                  <span
                    className="bg-ls-accent text-white font-mono rounded-[3px]"
                    style={{ fontSize: 9, padding: '2px 6px', letterSpacing: '0.5px' }}
                  >
                    THIS WEEK'S LEAD
                  </span>
                  <div className="font-serif font-semibold text-ink" style={{ fontSize: 16, lineHeight: 1.25, marginTop: 8 }}>
                    {featuredArticle.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-ink-3" style={{ fontSize: 11, marginTop: 8 }}>
                    <UserAvatar
                      avatarUrl={featuredArticle.authorProfile?.avatarUrl}
                      name={featuredArticle.authorProfile?.displayName}
                      size={14}
                    />
                    <span>{featuredArticle.authorProfile?.displayName}</span>
                    {featuredArticle.readingTimeMinutes && (
                      <>
                        <span>·</span>
                        <Clock size={10} />
                        <span>{featuredArticle.readingTimeMinutes} min</span>
                      </>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* Authenticated hero — clean greeting, no featured article */
        <section
          className="border-b border-line px-4 sm:px-8 lg:px-12"
          style={{ paddingTop: 20, paddingBottom: 18, background: 'var(--ls-bg-soft)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.3px' }}>
                {timeGreeting()}
              </span>
              <h1 className="font-serif font-bold text-ink" style={{ fontSize: 24, marginTop: 4 }}>
                Welcome back, {authorProfile?.displayName ?? 'there'}.
              </h1>
              {stats && (
                <div className="flex flex-wrap items-center" style={{ gap: '3px 18px', marginTop: 6 }}>
                  <span className="text-ink-3" style={{ fontSize: 12 }}>
                    <span className="font-semibold text-ink">{stats.articlesPublishedThisWeek}</span> articles this week
                  </span>
                  <span className="text-ink-3" style={{ fontSize: 12 }}>
                    <span className="font-semibold text-ink">{stats.totalAuthors?.toLocaleString()}</span> writers
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              <Link
                to={ROUTES.MY_BLOGS}
                className="border border-line text-ink-2 font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '7px 14px', fontSize: 13 }}
              >
                My blogs
              </Link>
              <Link
                to={ROUTES.DASHBOARD}
                className="border border-line text-ink-2 font-medium rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '7px 14px', fontSize: 13 }}
              >
                Dashboard
              </Link>
              <Link
                to={ROUTES.EDITOR_NEW}
                className="bg-ls-accent text-white font-semibold rounded-[6px] hover:bg-accent-ink transition-colors"
                style={{ padding: '7px 14px', fontSize: 13 }}
              >
                + Write
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BROWSE BY TYPE ────────────────────────────────────────────────────── */}
      <section
        className="bg-bg border-b border-line"
        style={{ position: 'sticky', top: 56, zIndex: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}
      >
        <div
          className="flex items-center overflow-x-auto px-4 sm:px-8 lg:px-12"
          style={{ gap: 4, paddingTop: 8, paddingBottom: 9, scrollbarWidth: 'none' }}
        >
          <span className="font-mono uppercase text-ink-3 flex-shrink-0 hidden sm:block" style={{ fontSize: 10, letterSpacing: '1.2px', marginRight: 6 }}>
            Browse
          </span>
          {ARTICLE_TYPE_FILTERS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setActiveType(pill.value)}
              className={cn(
                'flex-shrink-0 rounded-full font-sans transition-colors',
                activeType === pill.value
                  ? 'bg-ink text-bg font-semibold'
                  : 'text-ink-2 hover:bg-bg-tint hover:text-ink',
              )}
              style={{ padding: '5px 14px', fontSize: 12 }}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── TRENDING THIS WEEK ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12" style={{ paddingTop: 28, paddingBottom: 36 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <h2 className="font-serif font-bold text-ink flex-shrink-0" style={{ fontSize: 20 }}>
            Trending this week
          </h2>
          <div className="flex-1 border-t border-line-soft" />
          <Link
            to={ROUTES.EXPLORE}
            className="flex items-center gap-1 text-ls-accent flex-shrink-0 hover:opacity-80 transition-opacity"
            style={{ fontSize: 11 }}
          >
            See all <ArrowRight size={11} />
          </Link>
        </div>

        {/* Loading skeleton */}
        {isTrendingLoading && (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)' }}>
            <div className="rounded-[10px] border border-line bg-bg-tint animate-pulse" style={{ height: 400 }} />
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[8px] border border-line bg-bg-tint animate-pulse" style={{ height: 88 }} />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {homeError && !homeLoading && (
          <div
            className="border border-line rounded-[10px] bg-bg-soft flex flex-col items-center justify-center text-center"
            style={{ padding: '56px 32px' }}
          >
            <p className="text-ink-2 font-semibold" style={{ fontSize: 14 }}>Failed to load articles</p>
            <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>Check your connection and try again.</p>
          </div>
        )}

        {/* Empty state */}
        {!homeError && !isTrendingLoading && trendingArticles.length === 0 && (
          <div
            className="border border-line rounded-[10px] bg-bg-soft flex flex-col items-center justify-center text-center"
            style={{ padding: '56px 32px' }}
          >
            <div className="font-mono text-ink-3" style={{ fontSize: 24, marginBottom: 12 }}>◇</div>
            <p className="text-ink-2 font-semibold" style={{ fontSize: 14 }}>No articles yet</p>
            <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>
              {activeType ? 'No articles found for this type.' : 'Be the first to publish something.'}
            </p>
            {activeType && (
              <button
                onClick={() => setActiveType('')}
                className="mt-4 border border-line bg-bg text-ink-2 hover:bg-bg-tint rounded-[6px] transition-colors"
                style={{ fontSize: 13, padding: '7px 16px' }}
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Trending grid */}
        {!homeError && !isTrendingLoading && trendingArticles.length > 0 && (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)' }}>

            {/* ── Large feature card ── */}
            {trendingArticles[0] && (
              <Link
                to={buildRoute.blog(trendingArticles[0].slug)}
                className="rounded-[10px] border border-line overflow-hidden flex flex-col hover:border-line-strong hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative bg-bg-tint flex-shrink-0 overflow-hidden" style={{ height: 230 }}>
                  {trendingArticles[0].coverImageUrl ? (
                    <img
                      src={trendingArticles[0].coverImageUrl}
                      alt={`Cover for ${trendingArticles[0].title}`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-bg-soft" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  <span
                    className="absolute font-mono bg-ls-accent text-white rounded-[3px]"
                    style={{ fontSize: 9, padding: '2px 7px', top: 12, left: 14, letterSpacing: '0.5px' }}
                  >
                    #1 trending
                  </span>
                </div>
                <div className="flex flex-col flex-1" style={{ padding: '18px 20px 20px', gap: 8 }}>
                  <ArticleTypeBadge type={trendingArticles[0].articleType} />
                  <h3 className="font-serif font-bold text-ink" style={{ fontSize: 21, lineHeight: 1.2 }}>
                    {trendingArticles[0].title}
                  </h3>
                  {trendingArticles[0].summary && (
                    <p
                      className="text-ink-2 font-serif"
                      style={{
                        fontSize: 13.5, lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}
                    >
                      {trendingArticles[0].summary}
                    </p>
                  )}
                  <div
                    className="flex items-center mt-auto"
                    style={{ paddingTop: 12, borderTop: '1px solid var(--ls-line-soft)', gap: 8 }}
                  >
                    <UserAvatar
                      avatarUrl={trendingArticles[0].authorProfile?.avatarUrl}
                      name={trendingArticles[0].authorProfile?.displayName}
                      size={20}
                    />
                    <span className="text-ink-2" style={{ fontSize: 11.5 }}>
                      {trendingArticles[0].authorProfile?.displayName}
                    </span>
                    <span className="text-ink-3" style={{ fontSize: 11.5 }}>·</span>
                    <span className="text-ink-3" style={{ fontSize: 11.5 }}>
                      {formatDateShort(trendingArticles[0].publishedAt ?? trendingArticles[0].createdAt)}
                    </span>
                    {trendingArticles[0].readingTimeMinutes && (
                      <span className="flex items-center text-ink-3 ml-auto" style={{ gap: 4, fontSize: 11 }}>
                        <Clock size={10} />{trendingArticles[0].readingTimeMinutes} min
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* ── Sidebar stacked cards ── */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              {trendingArticles.slice(1, 5).map((blog, i) => (
                <Link
                  key={blog.id}
                  to={buildRoute.blog(blog.slug)}
                  className="flex items-start rounded-[8px] border border-line hover:border-line-strong hover:bg-bg-soft transition-all duration-150 group"
                  style={{ gap: 12, padding: '12px 14px' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                      <span className="font-mono text-ls-accent font-bold" style={{ fontSize: 10 }}>
                        #{i + 2}
                      </span>
                      <span className="font-mono text-ink-3 uppercase" style={{ fontSize: 9, letterSpacing: '0.3px' }}>
                        {articleTypeLabel(blog.articleType)}
                      </span>
                    </div>
                    <div
                      className="font-serif font-semibold text-ink group-hover:text-ls-accent transition-colors"
                      style={{ fontSize: 13.5, lineHeight: 1.3 }}
                    >
                      {blog.title}
                    </div>
                    <div
                      className="flex items-center flex-wrap text-ink-3"
                      style={{ gap: '2px 6px', marginTop: 6, fontSize: 10.5 }}
                    >
                      {blog.authorProfile?.displayName && <span>{blog.authorProfile.displayName}</span>}
                      <span>·</span>
                      <span>{formatDateShort(blog.publishedAt ?? blog.createdAt)}</span>
                      {blog.readingTimeMinutes && (
                        <>
                          <span>·</span>
                          <span className="flex items-center" style={{ gap: 2 }}>
                            <Clock size={9} />{blog.readingTimeMinutes} min
                          </span>
                        </>
                      )}
                      {blog.likesCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center" style={{ gap: 2 }}>
                            <Heart size={9} />{blog.likesCount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {blog.coverImageUrl ? (
                    <div className="flex-shrink-0 rounded-[5px] overflow-hidden" style={{ width: 68, height: 52 }}>
                      <img
                        src={blog.coverImageUrl}
                        alt={`Cover for ${blog.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 rounded-[5px] bg-bg-tint border border-line" style={{ width: 68, height: 52 }} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── RECENT DEEP DIVES + TAGS RAIL ─────────────────────────────────────── */}
      <section
        className="border-t border-line px-4 sm:px-8 lg:px-12 grid gap-10 lg:gap-14"
        style={{
          paddingTop: 32, paddingBottom: 40,
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
          background: 'var(--ls-bg-soft)',
        }}
      >
        {/* Recent deep dives */}
        <div>
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <h2 className="font-serif font-bold text-ink flex-shrink-0" style={{ fontSize: 20 }}>Recent deep dives</h2>
            <div className="flex-1 border-t border-line-soft" />
          </div>

          {!homeLoading && recentDeepDives.length === 0 && (
            <div className="text-ink-3 text-center py-8" style={{ fontSize: 13 }}>No deep dives yet.</div>
          )}

          <div className="flex flex-col">
            {recentDeepDives.map((blog) => (
              <BlogFeedCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Right rail — trending tags */}
        {trendingTags.length > 0 && (
          <div>
            <div
              className="font-mono uppercase text-ink-3"
              style={{ fontSize: 10, letterSpacing: '1.2px', borderTop: '1px solid var(--ls-line-soft)', paddingTop: 10, marginBottom: 14 }}
            >
              Trending tags · this week
            </div>
            <div className="flex flex-wrap" style={{ gap: 6 }}>
              {trendingTags.slice(0, 12).map((tag) => (
                <Link
                  key={tag.slug}
                  to={buildRoute.tag(tag.slug)}
                  className="inline-flex items-center gap-1.5 border border-line rounded-full hover:border-line-strong hover:bg-bg transition-all"
                  style={{ padding: '4px 12px', fontSize: 12, textDecoration: 'none' }}
                >
                  <span className="font-mono text-ink-2">#{tag.name}</span>
                  {tag.blogCount != null && (
                    <span className="font-mono text-ink-3" style={{ fontSize: 10 }}>{tag.blogCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── WRITER CTA (logged out only) ───────────────────────────────────────── */}
      {!isAuthenticated && (
        <section
          className="px-4 sm:px-8 lg:px-12"
          style={{ background: 'var(--ls-ink)', paddingTop: 'clamp(40px, 6vw, 64px)', paddingBottom: 'clamp(40px, 6vw, 64px)' }}
        >
          <div
            className="grid gap-10 items-center"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}
          >
            <div>
              <span className="font-mono uppercase text-ls-accent" style={{ fontSize: 10, letterSpacing: '1.4px' }}>
                For writers
              </span>
              <h2
                className="font-serif font-bold"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)', color: 'var(--ls-bg)', marginTop: 10, maxWidth: 560, lineHeight: 1.25 }}
              >
                Publish under your name, your company, or both. We handle the SEO, the OG images, and the build-in-public timeline.
              </h2>
              <ul
                className="flex flex-wrap"
                style={{ margin: '18px 0 0', padding: 0, listStyle: 'none', gap: '6px 28px', fontSize: 13, opacity: 0.75, color: 'var(--ls-bg)' }}
              >
                <li>— Auto-generated tag pages</li>
                <li>— Per-blog analytics</li>
                <li>— Scheduled publishing</li>
                <li>— No ads, ever</li>
              </ul>
            </div>
            <div className="flex flex-col sm:items-end" style={{ gap: 10 }}>
              <Link
                to={ROUTES.REGISTER}
                className="bg-ls-accent text-white font-semibold rounded-[6px] hover:bg-accent-ink transition-colors text-center"
                style={{ padding: '12px 26px', fontSize: 14 }}
              >
                Create your account
              </Link>
              <Link
                to={ROUTES.EXPLORE}
                className="rounded-[6px] text-center hover:bg-white/10 transition-colors font-medium"
                style={{ padding: '12px 26px', fontSize: 14, color: 'var(--ls-bg)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                Browse articles first
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
