import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel, formatDateShort } from '@/lib/utils'
import type { ArticleType } from '@/types/api'

const ARTICLE_TYPES: { label: string; value: ArticleType }[] = [
  { label: 'Engineering blog', value: 'engineering_blog' },
  { label: 'Architecture deep dive', value: 'architecture_deep_dive' },
  { label: 'Case study', value: 'case_study' },
  { label: 'Founder note', value: 'founder_note' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Postmortem', value: 'failure_postmortem' },
  { label: 'AI experiment', value: 'ai_experiment' },
  { label: 'Opinion', value: 'opinion_essay' },
  { label: 'Open source', value: 'open_source_release' },
  { label: 'Project showcase', value: 'project_showcase' },
  { label: 'Other', value: 'other' },
]

const DATE_RANGES: { label: string; value: 'week' | 'month' | '6months' | 'all' }[] = [
  { label: 'Last week', value: 'week' },
  { label: 'Last month', value: 'month' },
  { label: 'Last 6 months', value: '6months' },
  { label: 'All time', value: 'all' },
]

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeParam = searchParams.get('type') as ArticleType | null
  const tagParam = searchParams.get('tag')
  const dateParam = searchParams.get('dateRange') as 'week' | 'month' | '6months' | 'all' | null

  const [selectedTypes, setSelectedTypes] = useState<ArticleType[]>(typeParam ? [typeParam] : [])
  const [dateRange, setDateRange] = useState<'week' | 'month' | '6months' | 'all'>(dateParam ?? 'all')

  const params = {
    ...(selectedTypes.length === 1 ? { type: selectedTypes[0] } : {}),
    ...(tagParam ? { tag: tagParam } : {}),
    ...(dateRange !== 'all' ? { dateRange } : {}),
  }

  const { data: blogs, isLoading } = useExplore(Object.keys(params).length > 0 ? params : undefined)
  const articles = blogs ?? []

  function toggleType(value: ArticleType) {
    setSelectedTypes((prev) => {
      const next = prev.includes(value) ? prev.filter((t) => t !== value) : [value]
      const sp = new URLSearchParams(searchParams)
      if (next.length === 1) sp.set('type', next[0])
      else sp.delete('type')
      setSearchParams(sp, { replace: true })
      return next
    })
  }

  function clearAll() {
    setSelectedTypes([])
    setDateRange('all')
    setSearchParams({}, { replace: true })
  }

  const hasFilters = selectedTypes.length > 0 || (tagParam !== null) || dateRange !== 'all'

  return (
    <div className="flex flex-col min-h-screen">
      <div style={{ padding: '24px 48px 14px' }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Explore</span>
        <h1 className="font-serif font-bold text-ink" style={{ marginTop: 4, fontSize: 28 }}>
          Every blog on Lorestack{' '}
          <span className="text-ink-3 font-normal" style={{ fontSize: 14 }}>
            · {articles.length > 0 ? `${articles.length} articles` : 'articles'}
          </span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, padding: '0 48px 32px', flex: 1 }}>
        {/* Filter rail */}
        <div className="flex flex-col" style={{ gap: 18, fontSize: 12 }}>
          <div>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 6 }}>
              Article type
            </div>
            {ARTICLE_TYPES.map((t) => (
              <label
                key={t.value}
                className="flex items-center cursor-pointer"
                style={{ gap: 6, padding: '3px 0', color: 'var(--ls-ink-2)' }}
              >
                <span
                  className="rounded-[2px] border flex-shrink-0 transition-colors"
                  style={{
                    width: 13,
                    height: 13,
                    background: selectedTypes.includes(t.value) ? 'var(--ls-ink)' : 'var(--ls-bg)',
                    borderColor: selectedTypes.includes(t.value) ? 'var(--ls-ink)' : 'var(--ls-line)',
                  }}
                  onClick={() => toggleType(t.value)}
                />
                <span onClick={() => toggleType(t.value)}>{t.label}</span>
              </label>
            ))}
          </div>

          <div>
            <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 6 }}>
              Date range
            </div>
            {DATE_RANGES.map((r) => (
              <label
                key={r.value}
                className="flex items-center cursor-pointer"
                style={{ gap: 6, padding: '3px 0', color: 'var(--ls-ink-2)' }}
                onClick={() => setDateRange(r.value)}
              >
                <span
                  className="border flex-shrink-0 transition-colors"
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 99,
                    background: dateRange === r.value ? 'var(--ls-ink)' : 'transparent',
                    borderColor: 'var(--ls-line)',
                  }}
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
            <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
              {hasFilters && (
                <>
                  <span className="text-ink-3" style={{ fontSize: 12 }}>Active filters:</span>
                  {selectedTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className="bg-ink text-bg rounded-full font-sans"
                      style={{ fontSize: 11, padding: '3px 10px' }}
                    >
                      type: {articleTypeLabel(t)} ×
                    </button>
                  ))}
                  {tagParam && (
                    <span className="bg-ink text-bg rounded-full" style={{ fontSize: 11, padding: '3px 10px' }}>
                      tag: {tagParam} ×
                    </span>
                  )}
                  {dateRange !== 'all' && (
                    <button
                      onClick={() => setDateRange('all')}
                      className="bg-ink text-bg rounded-full font-sans"
                      style={{ fontSize: 11, padding: '3px 10px' }}
                    >
                      {DATE_RANGES.find((r) => r.value === dateRange)?.label} ×
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-ls-accent underline underline-offset-2"
                    style={{ fontSize: 11, marginLeft: 6 }}
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-[6px] border border-line bg-bg-tint animate-pulse" style={{ height: 100 }} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
              <p className="text-ink-3" style={{ fontSize: 13 }}>No articles found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {articles.map((blog) => (
                <Link
                  key={blog.id}
                  to={buildRoute.blog(blog.slug)}
                  className="hover:bg-bg-tint transition-colors"
                  style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '10px 0', borderTop: '1px solid var(--ls-line-soft)' }}
                >
                  <div className="rounded-[4px] bg-bg-tint border border-line" style={{ height: 80 }} />
                  <div className="flex flex-col" style={{ gap: 4 }}>
                    <span
                      className="self-start border border-line text-ink-2 rounded-[3px]"
                      style={{ fontSize: 10, padding: '2px 6px' }}
                    >
                      {articleTypeLabel(blog.articleType)}
                    </span>
                    <div className="font-serif font-semibold text-ink" style={{ fontSize: 14, lineHeight: 1.25 }}>
                      {blog.title}
                    </div>
                    <div className="text-ink-3 flex items-center" style={{ fontSize: 11, gap: 6 }}>
                      {formatDateShort(blog.publishedAt ?? blog.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
