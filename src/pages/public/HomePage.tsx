import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { useTrendingTags } from '@/api/hooks/useTagQueries'
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

const STATS = [
  ['2,419', 'writers shipping'],
  ['14,206', 'articles'],
  ['486', 'companies'],
  ['1.3M', 'reads / month'],
]

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, authorProfile } = useAuthStore()
  const [activeType, setActiveType] = useState<ArticleType | ''>('')
  const [email, setEmail] = useState('')

  const exploreParams = activeType ? { type: activeType } : undefined
  const { data: blogs } = useExplore(exploreParams)
  const { data: tags } = useTrendingTags()

  const trendingBlogs = blogs ?? []
  const trendingTags = tags ?? []

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      {!isAuthenticated ? (
        <section
          className="border-b border-line"
          style={{ padding: '48px 56px 32px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'center' }}
        >
          <div>
            <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
              A home for engineering stories
            </span>
            <h1
              className="font-serif font-bold text-ink"
              style={{ fontSize: 54, lineHeight: 1.02, marginTop: 10, maxWidth: 580 }}
            >
              Long-form writing for the people who actually{' '}
              <em className="text-ls-accent not-italic">ship</em>.
            </h1>
            <p className="font-serif text-ink-2" style={{ fontSize: 17, lineHeight: 1.55, marginTop: 16, maxWidth: 520 }}>
              Engineering blogs, architecture deep-dives, post-mortems and build-in-public timelines — under your name or your company's.
            </p>
            <div className="flex" style={{ gap: 10, marginTop: 24 }}>
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
              className="flex"
              style={{ gap: 36, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ls-line-soft)' }}
            >
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <div className="font-serif font-semibold text-ink" style={{ fontSize: 22 }}>{n}</div>
                  <div className="text-ink-3" style={{ fontSize: 11, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[8px] bg-bg-tint border border-line" style={{ height: 300 }} />
            <div
              className="absolute bg-bg border border-line rounded-[6px] shadow-sm"
              style={{ bottom: -20, left: -20, right: 32, padding: 14 }}
            >
              <span className="bg-ls-accent text-white font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                This week's lead
              </span>
              <div className="font-serif font-semibold text-ink" style={{ fontSize: 18, marginTop: 8, lineHeight: 1.25 }}>
                {trendingBlogs[0]?.title ?? 'How we cut p99 latency from 800ms → 120ms'}
              </div>
              <div className="text-ink-3 flex items-center" style={{ fontSize: 11, marginTop: 8, gap: 6 }}>
                <div
                  className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2"
                  style={{ width: 16, height: 16, fontSize: 8 }}
                >
                  {trendingBlogs[0] ? initials('A') : 'ZK'}
                </div>
                {trendingBlogs[0]?.authorId ? 'Author' : 'Ajay Kathwate'} · 8 min
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-line bg-bg-soft" style={{ padding: '24px 56px' }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Good morning</span>
              <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>
                Welcome back, {authorProfile?.displayName ?? 'there'}.
              </h1>
            </div>
            <div className="flex" style={{ gap: 8 }}>
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
      <section className="flex items-center" style={{ padding: '24px 56px 0', gap: 14, overflow: 'hidden' }}>
        <span className="font-mono uppercase text-ink-3 flex-shrink-0" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Browse by type
        </span>
        <div className="flex overflow-x-auto" style={{ gap: 6, flex: 1 }}>
          {TYPE_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => {
                setActiveType(pill.value)
              }}
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
      <section style={{ padding: '18px 56px 32px' }}>
        <div className="flex items-baseline" style={{ gap: 14, marginBottom: 14 }}>
          <h2 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Trending this week</h2>
          <div className="flex-1 border-t border-line" />
          <Link to={ROUTES.EXPLORE} className="text-ls-accent underline underline-offset-2" style={{ fontSize: 11 }}>
            See all →
          </Link>
        </div>

        {trendingBlogs.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 18 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: i === 0 ? 380 : 200 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 18 }}>
            {/* Big feature card */}
            {trendingBlogs[0] && (
              <Link
                to={buildRoute.blog(trendingBlogs[0].slug)}
                className="rounded-[6px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors"
              >
                <div className="bg-bg-tint" style={{ height: 260 }} />
                <div className="flex flex-col" style={{ padding: '18px 20px', gap: 8 }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="bg-ls-accent text-white font-mono rounded-[3px]" style={{ fontSize: 10, padding: '2px 6px' }}>
                      {articleTypeLabel(trendingBlogs[0].articleType)}
                    </span>
                    <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>#1 trending</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink" style={{ fontSize: 24, lineHeight: 1.15 }}>
                    {trendingBlogs[0].title}
                  </h3>
                  {trendingBlogs[0].summary && (
                    <p className="font-serif text-ink-2" style={{ fontSize: 14, lineHeight: 1.5 }}>
                      {trendingBlogs[0].summary}
                    </p>
                  )}
                  <div className="flex items-center text-ink-2" style={{ gap: 10, marginTop: 6, fontSize: 12 }}>
                    <span>{formatDateShort(trendingBlogs[0].publishedAt ?? trendingBlogs[0].createdAt)}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Right side grid */}
            <div style={{ display: 'grid', gridColumn: 'span 2', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {trendingBlogs.slice(1, 5).map((blog, i) => (
                <Link
                  key={blog.id}
                  to={buildRoute.blog(blog.slug)}
                  className="rounded-[6px] border border-line overflow-hidden flex flex-col hover:border-line-strong transition-colors"
                >
                  <div className="bg-bg-tint" style={{ height: 100 }} />
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
          </div>
        )}
      </section>

      {/* ── FEATURED COMPANIES ── */}
      <section className="border-t border-b border-line bg-bg-soft" style={{ padding: '24px 56px' }}>
        <div className="flex items-baseline" style={{ gap: 14, marginBottom: 14 }}>
          <h2 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Featured companies</h2>
          <span className="text-ink-3" style={{ fontSize: 12 }}>· hand-picked by the Lorestack team</span>
          <div className="flex-1 border-t border-line" />
          <button className="text-ls-accent underline underline-offset-2" style={{ fontSize: 11 }}>
            Browse all companies →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            ['Aurora Labs', 'Infra for the AI-native era', '24'],
            ['Hexa.io', 'Build-in-public dev tools', '18'],
            ['Northstar', 'Observability, done quietly', '14'],
            ['Quiver', 'Real-time databases for everyone', '12'],
            ['Lambdacat', 'Compilers, runtimes, snark', '9'],
            ['Verge', 'Edge platform for the JS-curious', '11'],
            ['Sift', 'Search infra for the unindexable', '7'],
            ['Plume', 'Distributed cron, finally', '5'],
          ].map(([name, tagline, count]) => (
            <div
              key={name}
              className="rounded-[6px] border border-line bg-bg flex flex-col"
              style={{ padding: 14, gap: 8 }}
            >
              <div className="flex items-center" style={{ gap: 10 }}>
                <div
                  className="rounded-[6px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2"
                  style={{ width: 36, height: 36, fontSize: 14 }}
                >
                  {name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-semibold text-ink truncate" style={{ fontSize: 13 }}>{name}</div>
                  <div className="text-ink-3 truncate" style={{ fontSize: 10 }}>{tagline}</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>{count} posts</span>
                <button
                  className="border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors"
                  style={{ padding: '3px 8px', fontSize: 11 }}
                >
                  + Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEEP DIVES + RIGHT RAIL ── */}
      <section style={{ padding: '32px 56px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 36 }}>
        {/* Recent deep dives */}
        <div>
          <div className="flex items-baseline" style={{ gap: 14, marginBottom: 14 }}>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Recent deep dives</h2>
            <div className="flex-1 border-t border-line" />
          </div>
          <div className="flex flex-col">
            {trendingBlogs.slice(0, 4).map((blog, i) => (
              <Link
                key={blog.id}
                to={buildRoute.blog(blog.slug)}
                className="hover:bg-bg-tint transition-colors"
                style={{ display: 'grid', gridTemplateColumns: '40px 1fr 160px', gap: 14, padding: '14px 0', borderTop: '1px solid var(--ls-line-soft)', alignItems: 'center' }}
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
                  <h3 className="font-serif font-semibold text-ink" style={{ fontSize: 16, marginTop: 6, lineHeight: 1.3 }}>
                    {blog.title}
                  </h3>
                </div>
                <div className="bg-bg-tint rounded-[4px]" style={{ height: 68 }} />
              </Link>
            ))}

            {trendingBlogs.length === 0 && (
              <div className="text-ink-3 text-center py-8" style={{ fontSize: 13 }}>No articles yet.</div>
            )}
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col" style={{ gap: 24 }}>
          {/* Trending tags */}
          <div>
            <div
              className="font-mono uppercase text-ink-3"
              style={{ fontSize: 10, letterSpacing: '1.2px', borderTop: '1px solid var(--ls-line-soft)', paddingTop: 10, marginBottom: 10 }}
            >
              Trending tags · this week
            </div>
            <div className="flex flex-wrap" style={{ gap: 6 }}>
              {(trendingTags.length > 0 ? trendingTags : [
                { slug: 'postgres', name: 'postgres' },
                { slug: 'llm', name: 'llm' },
                { slug: 'feature-flags', name: 'feature-flags' },
                { slug: 'observability', name: 'observability' },
                { slug: 'postmortem', name: 'postmortem' },
                { slug: 'kafka', name: 'kafka' },
              ] as { slug: string; name: string; blogCount?: number }[]).slice(0, 12).map((tag) => (
                <Link
                  key={tag.slug}
                  to={buildRoute.tag(tag.slug)}
                  className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors"
                  style={{ padding: '3px 10px', fontSize: 12 }}
                >
                  #{tag.name}
                  {'blogCount' in tag && tag.blogCount != null && (
                    <span className="font-mono text-ink-3 ml-1" style={{ fontSize: 10 }}>· {tag.blogCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Top writers */}
          <div>
            <div
              className="font-mono uppercase text-ink-3"
              style={{ fontSize: 10, letterSpacing: '1.2px', borderTop: '1px solid var(--ls-line-soft)', paddingTop: 10, marginBottom: 10 }}
            >
              Top writers · this week
            </div>
            <div className="rounded-[6px] border border-line overflow-hidden">
              {[
                ['ZK', 'Ajay Kathwate', 'Aurora Labs', '4.2k'],
                ['ML', 'Mei Lin', 'Hexa.io', '8.4k'],
                ['NR', 'Nikhil Rao', 'Aurora Labs', '5.6k'],
                ['SJ', 'Sam Jacobs', '—', '3.4k'],
              ].map(([ini, name, company, reads], i) => (
                <div
                  key={i}
                  className="flex items-center"
                  style={{ gap: 10, padding: '9px 12px', borderTop: i ? '1px solid var(--ls-line-soft)' : 'none' }}
                >
                  <span className="font-serif font-semibold text-ink-3" style={{ fontSize: 12, width: 14 }}>{i + 1}</span>
                  <div
                    className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
                    style={{ width: 26, height: 26, fontSize: 10 }}
                  >
                    {ini}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-ink font-semibold truncate" style={{ fontSize: 12 }}>{name}</div>
                    <div className="text-ink-3 truncate" style={{ fontSize: 10 }}>{company}</div>
                  </div>
                  <span className="font-mono text-ink-3" style={{ fontSize: 11 }}>↻ {reads}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILD-IN-PUBLIC ── */}
      <section className="border-t border-line bg-bg-soft" style={{ padding: '32px 56px' }}>
        <div className="flex items-baseline" style={{ gap: 14, marginBottom: 14 }}>
          <h2 className="font-serif font-bold text-ink" style={{ fontSize: 22 }}>Build-in-public this week</h2>
          <span className="text-ink-3" style={{ fontSize: 12 }}>· milestones from companies you can follow</span>
          <div className="flex-1 border-t border-line" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { co: 'Aurora Labs', logo: 'A', type: 'LAUNCH', title: 'Aurora v2 is live', d: 'May 12', metric: '10× write throughput' },
            { co: 'Hexa.io', logo: 'H', type: 'MILESTONE', title: 'Crossed 5,000 paying teams', d: 'May 09', metric: null },
            { co: 'Northstar', logo: 'N', type: 'FUNDING', title: 'Closed Series A', d: 'May 06', metric: '$14M' },
            { co: 'Quiver', logo: 'Q', type: 'INFRA', title: 'p99 dropped to 12ms globally', d: 'May 04', metric: null },
            { co: 'Verge', logo: 'V', type: 'PARTNERSHIP', title: 'Designated partner for re:Cloud', d: 'May 02', metric: null },
            { co: 'Plume', logo: 'P', type: 'HIRING', title: 'Two senior infra engineers joined', d: 'Apr 30', metric: null },
          ].map((m, i) => (
            <div key={i} className="rounded-[6px] border border-line bg-bg" style={{ padding: 14 }}>
              <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
                <div
                  className="rounded-[4px] bg-bg-tint border border-line flex items-center justify-center font-mono font-bold text-ink-2"
                  style={{ width: 24, height: 24, fontSize: 10 }}
                >
                  {m.logo}
                </div>
                <span className="font-semibold text-ink" style={{ fontSize: 12 }}>{m.co}</span>
                <span
                  className="ml-auto border border-line text-ink-3 rounded-[3px]"
                  style={{ fontSize: 9, padding: '1px 5px' }}
                >
                  {m.type}
                </span>
              </div>
              <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, lineHeight: 1.3 }}>{m.title}</div>
              <div className="text-ink-3" style={{ fontSize: 11, marginTop: 6 }}>{m.d}</div>
              {m.metric && (
                <span
                  className="inline-block bg-ls-accent/10 text-ls-accent rounded-full border border-ls-accent/20"
                  style={{ fontSize: 11, padding: '2px 8px', marginTop: 8 }}
                >
                  {m.metric}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── WRITER CTA (logged out only) ── */}
      {!isAuthenticated && (
        <section
          className="text-bg"
          style={{ padding: '48px 56px', background: 'var(--ls-ink)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'center' }}
        >
          <div>
            <span className="font-mono uppercase text-ls-accent" style={{ fontSize: 10, letterSpacing: 1.2 }}>
              For writers
            </span>
            <h2 className="font-serif font-bold" style={{ fontSize: 30, color: 'var(--ls-bg)', marginTop: 8, maxWidth: 580 }}>
              Publish under your name, your company, or both. We handle the SEO, the OG images, and the build-in-public timeline.
            </h2>
            <ul className="flex" style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', gap: 24, fontSize: 13, opacity: 0.85 }}>
              <li>— Auto-generated tag pages</li>
              <li>— Per-blog analytics</li>
              <li>— Scheduled publishing</li>
              <li>— No ads, ever</li>
            </ul>
          </div>
          <div className="flex flex-col items-end" style={{ gap: 10 }}>
            <Link
              to={ROUTES.REGISTER}
              className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
              style={{ padding: '12px 24px', fontSize: 14 }}
            >
              Create your account
            </Link>
            <button
              className="border text-bg rounded-[6px] transition-colors"
              style={{ padding: '12px 24px', fontSize: 14, borderColor: 'var(--ls-bg)', background: 'transparent' }}
            >
              Read the writer guide
            </button>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section
        className="border-t border-line"
        style={{ padding: '32px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}
      >
        <div>
          <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
            The weekly digest
          </span>
          <h3 className="font-serif font-bold text-ink" style={{ fontSize: 22, marginTop: 6 }}>
            The best engineering writing, in your inbox each Friday.
          </h3>
          <p className="text-ink-2" style={{ margin: '6px 0 0', fontSize: 13 }}>
            Hand-picked. 5-minute read. Unsubscribe anytime.
          </p>
        </div>
        <div className="flex" style={{ gap: 8 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.dev"
            className="flex-1 rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 focus:outline-none focus:ring-1 focus:ring-ls-accent focus:border-ls-accent transition-colors"
            style={{ height: 44, padding: '0 14px', fontSize: 13 }}
          />
          <button
            onClick={() => {
              if (email) {
                navigate(ROUTES.REGISTER)
              }
            }}
            className="bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
            style={{ height: 44, padding: '0 20px', fontSize: 14 }}
          >
            Subscribe
          </button>
        </div>
      </section>
    </div>
  )
}
