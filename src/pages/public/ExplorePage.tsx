import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, Bookmark, Clock } from 'lucide-react'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort, cn } from '@/lib/utils'
import type { ArticleType, BlogSummary } from '@/types/api'

const ARTICLE_TYPES: { label: string; value: ArticleType | 'all' }[] = [
  { label: 'All',              value: 'all' },
  { label: 'Engineering',      value: 'engineering_blog' },
  { label: 'Architecture',     value: 'architecture_deep_dive' },
  { label: 'Case study',       value: 'case_study' },
  { label: 'Founder note',     value: 'founder_note' },
  { label: 'Postmortem',       value: 'failure_postmortem' },
  { label: 'Tutorial',         value: 'tutorial' },
  { label: 'AI experiment',    value: 'ai_experiment' },
  { label: 'Opinion',          value: 'opinion_essay' },
  { label: 'Open source',      value: 'open_source_release' },
  { label: 'Scaling story',    value: 'scaling_story' },
  { label: 'Other',            value: 'other' },
]

const DATE_RANGES: { label: string; value: 'week' | 'month' | '6months' | 'all' }[] = [
  { label: 'All time',      value: 'all' },
  { label: 'Last week',     value: 'week' },
  { label: 'Last month',    value: 'month' },
  { label: 'Last 6 months', value: '6months' },
]

const PAGE_SIZE = 9

function ArticleCard({ blog }: { blog: BlogSummary }) {
  return (
    <Link
      to={buildRoute.blog(blog.slug)}
      className="flex flex-col bg-bg border border-line rounded-[6px] overflow-hidden hover:border-line-strong transition-colors group"
    >
      {/* Cover image placeholder */}
      <div
        className="flex-shrink-0 bg-bg-soft border-b border-line relative"
        style={{ height: 148 }}
      >
        {blog.coverImageUrl ? (
          <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, transparent 49.7%, var(--ls-line) 49.7% 50.3%, transparent 50.3%), var(--ls-bg-soft)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-ink-3 uppercase" style={{ fontSize: 9, letterSpacing: '1.2px' }}>cover</span>
            </div>
          </>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-3" style={{ gap: 6 }}>
        <span
          className="self-start font-mono uppercase text-ink-3 border border-line bg-bg-soft rounded-[3px]"
          style={{ fontSize: 9, padding: '2px 6px', letterSpacing: '0.6px' }}
        >
          {articleTypeLabel(blog.articleType)}
        </span>

        <div
          className="font-serif font-semibold text-ink group-hover:text-ink-2 transition-colors"
          style={{ fontSize: 14, lineHeight: 1.3 }}
        >
          {blog.title}
        </div>

        {blog.summary && (
          <p className="text-ink-3" style={{ fontSize: 12, lineHeight: 1.5, margin: 0, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {blog.summary}
          </p>
        )}

        <div className="mt-auto pt-2 border-t border-line-soft flex items-center gap-1.5 flex-wrap" style={{ marginTop: 'auto' }}>
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-ink-3 border border-line-soft rounded-full"
              style={{ fontSize: 10, padding: '1px 7px' }}
            >
              #{tag.name}
            </span>
          ))}
          <span className="ml-auto text-ink-3 font-mono" style={{ fontSize: 10 }}>
            {formatDateShort(blog.publishedAt ?? blog.createdAt)}
          </span>
        </div>
        {/* Metrics row */}
        <div className="flex items-center" style={{ gap: 10 }}>
          {blog.readingTimeMinutes != null && (
            <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 10 }}>
              <Clock size={9} />
              {blog.readingTimeMinutes} min
            </span>
          )}
          {blog.likesCount > 0 && (
            <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 10 }}>
              <Heart size={9} />
              {blog.likesCount}
            </span>
          )}
          {blog.savesCount > 0 && (
            <span className="flex items-center text-ink-3" style={{ gap: 3, fontSize: 10 }}>
              <Bookmark size={9} />
              {blog.savesCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function FeaturedCard({ blog }: { blog: BlogSummary }) {
  return (
    <Link
      to={buildRoute.blog(blog.slug)}
      className="flex flex-col bg-bg border border-line rounded-[6px] overflow-hidden hover:border-line-strong transition-colors group"
    >
      <div className="flex-shrink-0 bg-bg-soft border-b border-line relative" style={{ height: 240 }}>
        {blog.coverImageUrl ? (
          <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, transparent 49.7%, var(--ls-line) 49.7% 50.3%, transparent 50.3%), var(--ls-bg-soft)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-ink-3 uppercase" style={{ fontSize: 9, letterSpacing: '1.2px' }}>cover · 1200 × 630</span>
            </div>
          </>
        )}
      </div>
      <div className="p-4 flex flex-col" style={{ gap: 8 }}>
        <div className="flex items-center gap-2">
          <span
            className="font-mono uppercase text-ls-accent border border-accent-soft bg-accent-soft rounded-[3px]"
            style={{ fontSize: 9, padding: '2px 6px', letterSpacing: '0.6px' }}
          >
            {articleTypeLabel(blog.articleType)}
          </span>
        </div>
        <div className="font-serif font-semibold text-ink" style={{ fontSize: 20, lineHeight: 1.2 }}>
          {blog.title}
        </div>
        {blog.summary && (
          <p className="font-serif text-ink-2" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            {blog.summary}
          </p>
        )}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-line-soft" style={{ marginTop: 4 }}>
          {blog.tags.slice(0, 4).map((tag) => (
            <span
              key={tag.id}
              className="text-ink-3 border border-line-soft rounded-full"
              style={{ fontSize: 10, padding: '1px 7px' }}
            >
              #{tag.name}
            </span>
          ))}
          <span className="ml-auto text-ink-3 font-mono" style={{ fontSize: 11 }}>
            {formatDateShort(blog.publishedAt ?? blog.createdAt)}
          </span>
        </div>
        {/* Metrics row */}
        <div className="flex items-center" style={{ gap: 12 }}>
          {blog.readingTimeMinutes != null && (
            <span className="flex items-center text-ink-3" style={{ gap: 4, fontSize: 11 }}>
              <Clock size={11} />
              {blog.readingTimeMinutes} min
            </span>
          )}
          {blog.likesCount > 0 && (
            <span className="flex items-center text-ink-3" style={{ gap: 4, fontSize: 11 }}>
              <Heart size={11} />
              {blog.likesCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

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

  const queryParams = {
    ...(activeType !== 'all' ? { type: activeType as ArticleType } : {}),
    ...(tagParam ? { tag: tagParam } : {}),
    ...(dateRange !== 'all' ? { dateRange } : {}),
  }

  const { data: blogs, isLoading } = useExplore(Object.keys(queryParams).length > 0 ? queryParams : undefined)
  const allArticles = blogs ?? []

  const hasFilters = activeType !== 'all' || tagParam !== null || dateRange !== 'all'
  const featured = !hasFilters && allArticles.length > 0 ? allArticles[0] : null
  const articlePool = featured ? allArticles.slice(1) : allArticles
  const totalPages = Math.max(1, Math.ceil(articlePool.length / PAGE_SIZE))
  const pageArticles = articlePool.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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

  const activeFilterCount = (activeType !== 'all' ? 1 : 0) + (tagParam ? 1 : 0) + (dateRange !== 'all' ? 1 : 0)

  return (
    <div className="px-4 sm:px-8 lg:px-12 pb-14">
      {/* ── Header ── */}
      <div style={{ padding: '28px 0 22px' }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.4px' }}>
          Explore
        </span>
        <h1 className="font-serif font-semibold text-ink" style={{ fontSize: 34, marginTop: 6, marginBottom: 8, lineHeight: 1.1 }}>
          Engineering writing, hand-collected.
        </h1>
        <p className="text-ink-3" style={{ fontSize: 13 }}>
          {isLoading ? 'Loading…' : `${allArticles.length} article${allArticles.length !== 1 ? 's' : ''}`}
          {hasFilters && (
            <span> · filtered by {activeFilterCount} criteria</span>
          )}
        </p>
      </div>

      {/* ── Type chips row ── */}
      <div
        className="flex gap-2 border-b border-line pb-3 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {ARTICLE_TYPES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => selectType(value)}
            className={cn(
              'flex-shrink-0 rounded-full border font-sans transition-colors',
              activeType === value
                ? 'bg-ink text-bg border-ink'
                : 'bg-bg text-ink-2 border-line hover:border-line-strong hover:text-ink',
            )}
            style={{ fontSize: 12, padding: '4px 12px' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div
        className="flex flex-wrap items-center gap-3 border-b border-line"
        style={{ padding: '10px 0', fontSize: 12 }}
      >
        <span className="text-ink-3">All articles within</span>

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

        <div className="flex-1" />

        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {activeType !== 'all' && (
              <button
                onClick={() => selectType('all')}
                className="inline-flex items-center bg-ink text-bg rounded-full font-sans"
                style={{ fontSize: 10, padding: '3px 9px' }}
              >
                type: {articleTypeLabel(activeType as ArticleType)} ×
              </button>
            )}
            {tagParam && (
              <span
                className="inline-flex items-center bg-ink text-bg rounded-full"
                style={{ fontSize: 10, padding: '3px 9px' }}
              >
                tag: {tagParam}
              </span>
            )}
            {dateRange !== 'all' && (
              <button
                onClick={() => { setDateRange('all'); setPage(1) }}
                className="inline-flex items-center bg-ink text-bg rounded-full font-sans"
                style={{ fontSize: 10, padding: '3px 9px' }}
              >
                {DATE_RANGES.find((r) => r.value === dateRange)?.label} ×
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-ls-accent underline underline-offset-2 hover:text-accent-ink transition-colors"
              style={{ fontSize: 11 }}
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 border border-line bg-bg rounded-[4px]" style={{ padding: '3px 8px' }}>
          <span className="text-ink-3" style={{ fontSize: 11 }}>Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-ink-2 outline-none cursor-pointer"
            style={{ fontSize: 11 }}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most read</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div style={{ marginTop: 28 }}>
          <div className="animate-pulse rounded-[6px] bg-bg-tint border border-line" style={{ height: 240, marginBottom: 28 }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-[6px] bg-bg-tint border border-line" style={{ height: 240 }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && allArticles.length === 0 && (
        <div
          className="border border-line rounded-[6px] bg-bg-soft flex flex-col items-center justify-center text-center"
          style={{ padding: '64px 32px', marginTop: 28 }}
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

      {/* ── Featured article ── */}
      {!isLoading && featured && (
        <div style={{ marginTop: 28 }}>
          <div
            className="font-mono uppercase text-ink-3 border-t border-line"
            style={{ fontSize: 10, letterSpacing: '1.2px', paddingTop: 12, marginBottom: 14 }}
          >
            Featured this week
          </div>
          <div style={{ maxWidth: 680 }}>
            <FeaturedCard blog={featured} />
          </div>
        </div>
      )}

      {/* ── All articles ── */}
      {!isLoading && allArticles.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div
            className="font-mono uppercase text-ink-3 border-t border-line"
            style={{ fontSize: 10, letterSpacing: '1.2px', paddingTop: 12, marginBottom: 14 }}
          >
            {featured ? 'All articles' : 'Results'}
            {' '}
            <span style={{ color: 'var(--ls-ink-4)' }}>· {articlePool.length}</span>
          </div>

          {pageArticles.length === 0 ? (
            <p className="text-ink-3" style={{ fontSize: 13, paddingTop: 8 }}>No more articles on this page.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              {pageArticles.map((blog) => (
                <ArticleCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </div>
      )}
    </div>
  )
}
