import { useSearchParams } from 'react-router-dom'
import { useExplorePaginated } from '@/api/hooks/useBlogQueries'
import { useHome } from '@/api/hooks/useHomeQuery'
import { cn } from '@/lib/utils'
import { BlogFeedCard } from '@/shared/components/cards/BlogFeedCard'
import { ARTICLE_TYPE_FILTERS } from '@/constants/articleTypes'
import type { ArticleType } from '@/types/api'

const DATE_RANGES: { label: string; value: 'week' | 'month' | '6months' | 'all' }[] = [
  { label: 'All time',      value: 'all' },
  { label: 'Last week',     value: 'week' },
  { label: 'Last month',    value: 'month' },
  { label: 'Last 6 months', value: '6months' },
]

const SORT_OPTIONS = [
  { label: 'Newest',  value: 'newest' },
  { label: 'Oldest',  value: 'oldest' },
]

const PAGE_SIZE = 20

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
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
    <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 36 }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(btnBase, 'border-line text-ink-2 hover:bg-bg-tint disabled:opacity-30 disabled:cursor-not-allowed')}
        style={btnStyle}
        aria-label="Previous page"
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
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              btnBase,
              p === page ? 'bg-ink text-bg border-ink' : 'border-line text-ink-2 hover:bg-bg-tint',
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
        aria-label="Next page"
      >
        →
      </button>
    </div>
  )
}

export function ExplorePage() {
  // URL is the single source of truth for ALL filter state
  const [searchParams, setSearchParams] = useSearchParams()

  const typeParam = (searchParams.get('type') as ArticleType) || ''
  const tagParam = searchParams.get('tag') || ''
  const dateParam = (searchParams.get('dateRange') as 'week' | 'month' | '6months' | 'all') || 'all'
  const sortParam = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest'
  const pageParam = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  function updateParam(key: string, value: string, resetPage = true) {
    const sp = new URLSearchParams(searchParams)
    if (value && value !== 'all' && value !== 'newest') sp.set(key, value)
    else sp.delete(key)
    if (resetPage) sp.delete('page')
    setSearchParams(sp, { replace: true })
  }

  function clearAll() {
    setSearchParams({}, { replace: true })
  }

  const queryParams = {
    ...(typeParam ? { type: typeParam as ArticleType } : {}),
    ...(tagParam ? { tag: tagParam } : {}),
    ...(dateParam !== 'all' ? { dateRange: dateParam } : {}),
    sort: sortParam,
    page: pageParam,
    limit: PAGE_SIZE,
  }

  const { data: pageData, isLoading, isError } = useExplorePaginated(queryParams)
  const { data: homeData } = useHome()
  const trendingTags = homeData?.trendingTags ?? []

  const articles = pageData?.data ?? []
  const total = pageData?.meta?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasFilters = !!(typeParam || tagParam || dateParam !== 'all')
  const activeFilterCount = (typeParam ? 1 : 0) + (tagParam ? 1 : 0) + (dateParam !== 'all' ? 1 : 0)

  return (
    <div className="flex flex-col">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div
        className="border-b border-line px-4 sm:px-8 lg:px-12"
        style={{ paddingTop: 32, paddingBottom: 20, background: 'var(--ls-bg-soft)' }}
      >
        <span className="font-mono uppercase text-ls-accent" style={{ fontSize: 10, letterSpacing: '1.5px' }}>
          Explore
        </span>
        <h1 className="font-serif font-semibold text-ink" style={{ fontSize: 30, marginTop: 6, lineHeight: 1.1 }}>
          Engineering writing, hand-collected.
        </h1>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 6 }}>
          {isLoading ? (
            <span className="inline-block w-20 h-3 bg-bg-tint animate-pulse rounded" />
          ) : (
            <>
              <span className="font-semibold text-ink">{total}</span> article{total !== 1 ? 's' : ''}
              {hasFilters && (
                <span className="text-ink-3"> · {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span>
              )}
            </>
          )}
        </p>
      </div>

      {/* ── Type filter chips — sticky ────────────────────────────────────────── */}
      <div
        className="bg-bg border-b border-line"
        style={{ position: 'sticky', top: 56, zIndex: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}
      >
        <div
          className="flex gap-1.5 overflow-x-auto px-4 sm:px-8 lg:px-12"
          style={{ paddingTop: 8, paddingBottom: 9, scrollbarWidth: 'none' }}
        >
          {ARTICLE_TYPE_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => updateParam('type', value)}
              className={cn(
                'flex-shrink-0 font-sans transition-colors rounded-full',
                typeParam === value
                  ? 'bg-ink text-bg font-semibold'
                  : 'text-ink-2 hover:bg-bg-tint hover:text-ink',
              )}
              style={{ fontSize: 12, padding: '5px 14px' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content: sidebar + feed ─────────────────────────────────────── */}
      <div
        className="flex gap-10 px-4 sm:px-8 lg:px-12"
        style={{ paddingTop: 28, paddingBottom: 40, alignItems: 'flex-start' }}
      >

        {/* ── Left sidebar ── */}
        <aside
          className="hidden lg:flex flex-col flex-shrink-0"
          style={{ width: 210, position: 'sticky', top: 46 + 82, gap: 20 }}
        >
          {/* Filters */}
          <div className="flex flex-col" style={{ gap: 10 }}>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>
              Filters
            </div>
            <div className="flex flex-col" style={{ gap: 8 }}>
              <div className="flex items-center justify-between">
                <span className="text-ink-3" style={{ fontSize: 12 }}>Within</span>
                <select
                  value={dateParam}
                  onChange={(e) => updateParam('dateRange', e.target.value)}
                  className="border border-line bg-bg text-ink-2 rounded-[4px] outline-none cursor-pointer hover:border-line-strong transition-colors"
                  style={{ fontSize: 11, padding: '3px 8px' }}
                  aria-label="Date range filter"
                >
                  {DATE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-3" style={{ fontSize: 12 }}>Sort</span>
                <select
                  value={sortParam}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="border border-line bg-bg text-ink-2 rounded-[4px] outline-none cursor-pointer hover:border-line-strong transition-colors"
                  style={{ fontSize: 11, padding: '3px 8px' }}
                  aria-label="Sort order"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="self-start text-ls-accent underline underline-offset-2 hover:opacity-75 transition-opacity"
                style={{ fontSize: 11 }}
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="border-t border-line-soft" />

          {/* Trending tags */}
          {trendingTags.length > 0 && (
            <div className="flex flex-col" style={{ gap: 10 }}>
              <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px' }}>
                Trending tags
              </div>
              <div className="flex flex-wrap" style={{ gap: 5 }}>
                {trendingTags.slice(0, 15).map((tag) => {
                  const isActive = tagParam === tag.slug
                  return (
                    <button
                      key={tag.slug}
                      onClick={() => updateParam('tag', isActive ? '' : tag.slug)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border font-sans transition-all',
                        isActive
                          ? 'bg-ink text-bg border-ink'
                          : 'border-line text-ink-2 hover:border-line-strong hover:bg-bg-tint',
                      )}
                      style={{ padding: '3px 10px', fontSize: 12 }}
                    >
                      <span className="font-mono">#{tag.name}</span>
                      {tag.blogCount != null && (
                        <span className="font-mono opacity-60" style={{ fontSize: 10 }}>{tag.blogCount}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        {/* ── Mobile filter row ── */}
        <div className="lg:hidden w-full flex items-center gap-2 mb-4 flex-wrap">
          <select
            value={dateParam}
            onChange={(e) => updateParam('dateRange', e.target.value)}
            className="border border-line bg-bg text-ink-2 rounded-[4px] outline-none cursor-pointer"
            style={{ fontSize: 12, padding: '5px 8px' }}
            aria-label="Date range filter"
          >
            {DATE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select
            value={sortParam}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border border-line bg-bg text-ink-2 rounded-[4px] outline-none cursor-pointer"
            style={{ fontSize: 12, padding: '5px 8px' }}
            aria-label="Sort order"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearAll} className="text-ls-accent underline underline-offset-2" style={{ fontSize: 12 }}>
              Clear
            </button>
          )}
        </div>

        {/* ── Feed column ── */}
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

          {/* Error state */}
          {isError && !isLoading && (
            <div
              className="border border-line rounded-[10px] bg-bg-soft flex flex-col items-center justify-center text-center"
              style={{ padding: '56px 32px' }}
            >
              <p className="text-ink-2 font-semibold" style={{ fontSize: 14 }}>Failed to load articles</p>
              <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4 }}>Check your connection and try again.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && articles.length === 0 && (
            <div
              className="border border-line rounded-[10px] bg-bg-soft flex flex-col items-center justify-center text-center"
              style={{ padding: '72px 40px' }}
            >
              <div className="font-mono text-ink-3" style={{ fontSize: 24, marginBottom: 14 }}>◇</div>
              <p className="text-ink-2 font-semibold" style={{ fontSize: 14, marginBottom: 4 }}>No articles found</p>
              <p className="text-ink-3" style={{ fontSize: 13 }}>Try adjusting or clearing your filters.</p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="mt-5 border border-line bg-bg text-ink-2 hover:bg-bg-tint rounded-[6px] transition-colors"
                  style={{ fontSize: 13, padding: '7px 16px' }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Feed */}
          {!isLoading && !isError && articles.length > 0 && (
            <>
              <div
                className="font-mono uppercase text-ink-3"
                style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 14 }}
              >
                {hasFilters ? 'Results' : 'All articles'}
                {' · '}
                <span className="text-ink font-semibold">{total}</span>
              </div>
              <div className="flex flex-col">
                {articles.map((blog) => (
                  <BlogFeedCard key={blog.id} blog={blog} />
                ))}
              </div>
              <Pagination
                page={pageParam}
                totalPages={totalPages}
                onPageChange={(p) => {
                  const sp = new URLSearchParams(searchParams)
                  if (p === 1) sp.delete('page')
                  else sp.set('page', String(p))
                  setSearchParams(sp, { replace: true })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
