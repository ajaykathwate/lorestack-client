import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { useHome } from '@/api/hooks/useHomeQuery'
import { cn } from '@/lib/utils'
import { BlogFeedCard } from '@/shared/components/cards/BlogFeedCard'
import type { ArticleType } from '@/types/api'

const ARTICLE_TYPES: { label: string; value: ArticleType | 'all' }[] = [
  { label: 'All',           value: 'all' },
  { label: 'Engineering',   value: 'engineering_blog' },
  { label: 'Architecture',  value: 'architecture_deep_dive' },
  { label: 'Case study',    value: 'case_study' },
  { label: 'Founder note',  value: 'founder_note' },
  { label: 'Postmortem',    value: 'failure_postmortem' },
  { label: 'Tutorial',      value: 'tutorial' },
  { label: 'AI experiment', value: 'ai_experiment' },
  { label: 'Opinion',       value: 'opinion_essay' },
  { label: 'Open source',   value: 'open_source_release' },
  { label: 'Scaling story', value: 'scaling_story' },
  { label: 'Other',         value: 'other' },
]

const DATE_RANGES: { label: string; value: 'week' | 'month' | '6months' | 'all' }[] = [
  { label: 'All time',      value: 'all' },
  { label: 'Last week',     value: 'week' },
  { label: 'Last month',    value: 'month' },
  { label: 'Last 6 months', value: '6months' },
]

const PAGE_SIZE = 12

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase = 'font-mono border rounded-[4px] transition-colors'
  const btnStyle = { width: 30, height: 30, fontSize: 12 }

  return (
    <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 32 }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(btnBase, 'border-line text-ink-2 hover:bg-bg-tint disabled:opacity-30 disabled:cursor-not-allowed')}
        style={btnStyle}
      >
        ←
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className="text-ink-3" style={{ fontSize: 12, width: 24, textAlign: 'center' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              btnBase,
              p === page
                ? 'bg-ink text-bg border-ink'
                : 'border-line text-ink-2 hover:bg-bg-tint',
            )}
            style={btnStyle}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(btnBase, 'border-line text-ink-2 hover:bg-bg-tint disabled:opacity-30 disabled:cursor-not-allowed')}
        style={btnStyle}
      >
        →
      </button>
    </div>
  )
}

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeParam = searchParams.get('type') as ArticleType | null
  const tagParam = searchParams.get('tag')
  const dateParam = searchParams.get('dateRange') as 'week' | 'month' | '6months' | 'all' | null

  const [activeType, setActiveType] = useState<ArticleType | 'all'>(typeParam ?? 'all')
  const [dateRange, setDateRange] = useState<'week' | 'month' | '6months' | 'all'>(dateParam ?? 'all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const queryParams = {
    ...(activeType !== 'all' ? { type: activeType as ArticleType } : {}),
    ...(tagParam ? { tag: tagParam } : {}),
    ...(dateRange !== 'all' ? { dateRange } : {}),
  }

  const { data: blogs, isLoading } = useExplore(Object.keys(queryParams).length > 0 ? queryParams : undefined)
  const { data: homeData } = useHome()
  const trendingTags = homeData?.trendingTags ?? []

  const allArticles = blogs ?? []
  const hasFilters = activeType !== 'all' || tagParam !== null || dateRange !== 'all'

  const q = searchQuery.trim().toLowerCase()
  const articlePool = q
    ? allArticles.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        (b.summary ?? '').toLowerCase().includes(q) ||
        (b.authorProfile?.displayName ?? '').toLowerCase().includes(q) ||
        b.tags.some((t) => t.name.toLowerCase().includes(q)),
      )
    : allArticles

  const totalPages = Math.max(1, Math.ceil(articlePool.length / PAGE_SIZE))
  const pageArticles = articlePool.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeFilterCount = (activeType !== 'all' ? 1 : 0) + (tagParam ? 1 : 0) + (dateRange !== 'all' ? 1 : 0)

  function selectType(value: ArticleType | 'all') {
    setActiveType(value)
    setPage(1)
    const sp = new URLSearchParams(searchParams)
    if (value !== 'all') sp.set('type', value)
    else sp.delete('type')
    setSearchParams(sp, { replace: true })
  }

  function clearAll() {
    setActiveType('all')
    setDateRange('all')
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="flex flex-col">

      {/* ── Header ── */}
      <div className="px-4 sm:px-8 lg:px-12" style={{ padding: '28px 48px 18px' }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.4px' }}>
          Explore
        </span>
        <h1 className="font-serif font-semibold text-ink" style={{ fontSize: 32, marginTop: 6, marginBottom: 6, lineHeight: 1.1 }}>
          Engineering writing, hand-collected.
        </h1>
        <p className="text-ink-3" style={{ fontSize: 13 }}>
          {isLoading ? 'Loading…' : `${articlePool.length} article${articlePool.length !== 1 ? 's' : ''}`}
          {(hasFilters || q) && <span> · {activeFilterCount + (q ? 1 : 0)} filter{activeFilterCount + (q ? 1 : 0) !== 1 ? 's' : ''} active</span>}
        </p>
      </div>

      {/* ── Sticky filter zone ── */}
      <div
        className="bg-bg border-b border-line"
        style={{ position: 'sticky', top: 56, zIndex: 20, boxShadow: '0 2px 12px rgba(0,0,0,.07)', paddingTop: 10 }}
      >
        {/* Type chips row */}
        <div
          className="flex gap-1.5 overflow-x-auto border-b border-line-soft"
          style={{ padding: '0 48px 10px', scrollbarWidth: 'none' }}
        >
          {ARTICLE_TYPES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => selectType(value)}
              className={cn(
                'flex-shrink-0 font-sans transition-colors rounded-full',
                activeType === value
                  ? 'bg-ink text-bg font-medium'
                  : 'text-ink-2 hover:bg-bg-tint hover:text-ink',
              )}
              style={{ fontSize: 12, padding: '5px 14px' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content: sidebar + feed ── */}
      <div
        className="flex gap-10 px-4 sm:px-8 lg:px-12"
        style={{ padding: '28px 48px', alignItems: 'flex-start' }}
      >

        {/* Left sidebar */}
        <aside
          className="hidden lg:flex flex-col flex-shrink-0"
          style={{ width: 210, position: 'sticky', top: 46 + 82, gap: 16 }}
        >
          {/* Mini search */}
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              placeholder="Search articles…"
              className="w-full border border-line bg-bg text-ink rounded-[6px] outline-none focus:border-line-strong transition-colors placeholder:text-ink-3"
              style={{ fontSize: 12, padding: '7px 10px 7px 28px' }}
            />
            <svg
              className="absolute text-ink-3 pointer-events-none"
              style={{ left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>Filters</div>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <div className="flex items-center justify-between">
                <span className="text-ink-3" style={{ fontSize: 12 }}>Within</span>
                <select
                  value={dateRange}
                  onChange={(e) => { setDateRange(e.target.value as typeof dateRange); setPage(1) }}
                  className="border border-line bg-bg text-ink-2 rounded-[4px] outline-none cursor-pointer hover:border-line-strong transition-colors"
                  style={{ fontSize: 11, padding: '3px 8px' }}
                >
                  {DATE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-3" style={{ fontSize: 12 }}>Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-line bg-bg text-ink-2 rounded-[4px] outline-none cursor-pointer hover:border-line-strong transition-colors"
                  style={{ fontSize: 11, padding: '3px 8px' }}
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most read</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="self-start text-ls-accent underline underline-offset-2 hover:text-accent-ink transition-colors"
                style={{ fontSize: 11 }}
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="border-t border-line-soft" />

          {/* Trending tags */}
          {trendingTags.length > 0 && (
            <div className="flex flex-col" style={{ gap: 8 }}>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>
                Trending tags
              </div>
              <div className="flex flex-wrap" style={{ gap: 6 }}>
                {trendingTags.slice(0, 15).map((tag) => {
                  const isActive = tagParam === tag.slug
                  return (
                    <button
                      key={tag.slug}
                      onClick={() => {
                        const sp = new URLSearchParams(searchParams)
                        if (isActive) sp.delete('tag')
                        else sp.set('tag', tag.slug)
                        setPage(1)
                        setSearchParams(sp, { replace: true })
                      }}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border font-sans transition-colors',
                        isActive
                          ? 'bg-ink text-bg border-ink'
                          : 'border-line hover:border-line-strong hover:bg-bg-tint',
                      )}
                      style={{ padding: '3px 10px', fontSize: 12 }}
                    >
                      <span className="font-mono">#{tag.name}</span>
                      {tag.blogCount != null && (
                        <span className="font-mono opacity-70" style={{ fontSize: 10 }}>{tag.blogCount}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Right feed */}
        <div className="flex-1 min-w-0">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex flex-col" style={{ gap: 10 }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse border border-line rounded-[8px]"
                  style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 110px', gap: 14, height: 120 }}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="bg-bg-tint rounded-full h-2.5 w-20" />
                    <div className="bg-bg-tint rounded h-5 w-3/4" />
                    <div className="bg-bg-tint rounded h-3.5 w-full" />
                    <div className="bg-bg-tint rounded h-3.5 w-2/3" />
                  </div>
                  <div className="bg-bg-tint rounded-[6px]" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && allArticles.length === 0 && (
            <div
              className="border border-line rounded-[8px] bg-bg-soft flex flex-col items-center justify-center text-center"
              style={{ padding: '64px 32px' }}
            >
              <div className="font-mono text-ink-3" style={{ fontSize: 28, marginBottom: 12 }}>◇</div>
              <p className="text-ink-2 font-semibold" style={{ fontSize: 14, marginBottom: 4 }}>No articles found</p>
              <p className="text-ink-3" style={{ fontSize: 13 }}>Try adjusting or clearing your filters.</p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="mt-4 border border-line bg-bg text-ink-2 hover:bg-bg-tint rounded-[6px] transition-colors"
                  style={{ fontSize: 13, padding: '7px 16px' }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Feed */}
          {!isLoading && pageArticles.length > 0 && (
            <>
              <div
                className="font-mono uppercase text-ink-3"
                style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 12 }}
              >
                {hasFilters ? 'Results' : 'All articles'}
                {' · '}
                <span>{articlePool.length}</span>
              </div>
              <div className="flex flex-col">
                {pageArticles.map((blog) => (
                  <BlogFeedCard key={blog.id} blog={blog} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
