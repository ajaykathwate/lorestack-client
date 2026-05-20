import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTags, useTrendingTags } from '@/api/hooks/useTagQueries'
import { buildRoute } from '@/constants/routes'
import { Spinner } from '@/shared/components/feedback/Spinner'

export function TagsPage() {
  const [query, setQuery] = useState('')
  const { data: allTags, isLoading } = useTags()
  const { data: trending } = useTrendingTags()

  const q = query.trim().toLowerCase()
  const filtered = (allTags ?? []).filter(
    (t) => !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
  )

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-line" style={{ padding: '40px 48px 24px' }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>
          Browse
        </span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 40, marginTop: 6 }}>
          Topics &amp; Tags
        </h1>
        <p className="font-serif text-ink-2" style={{ maxWidth: 520, marginTop: 8, fontSize: 14 }}>
          Every tag used across {allTags?.length ?? '—'} topics on Lorestack. Click any tag to browse its articles.
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 border border-line bg-bg-soft rounded-[6px] text-ink-3 hover:border-line-strong transition-colors"
          style={{ marginTop: 16, padding: '8px 12px', fontSize: 13, maxWidth: 360 }}
        >
          <span className="font-mono text-ink-2" style={{ fontSize: 15 }}>⌕</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tags…"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-3 focus:outline-none"
            style={{ fontSize: 13 }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-ink-3 hover:text-ink font-mono" style={{ fontSize: 11 }}>
              ×
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '28px 48px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
        {/* Main: all tags */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ padding: 60 }}>
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center text-ink-3" style={{ padding: 60, fontSize: 13 }}>
              No tags match "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              <div
                className="font-mono uppercase text-ink-3"
                style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 12 }}
              >
                {q ? `${filtered.length} results` : `All tags · ${filtered.length}`}
              </div>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {filtered.map((tag) => (
                  <Link
                    key={tag.id}
                    to={buildRoute.tag(tag.slug)}
                    className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors flex items-center"
                    style={{ padding: '6px 14px', fontSize: 13 }}
                  >
                    <span>#{tag.name}</span>
                    {'blogCount' in tag && (tag as { blogCount?: number }).blogCount != null && (
                      <span className="font-mono text-ink-3 ml-2" style={{ fontSize: 10 }}>
                        {(tag as { blogCount?: number }).blogCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right rail: trending */}
        <div>
          <div
            className="font-mono uppercase text-ink-3"
            style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}
          >
            Trending this week
          </div>
          <div className="flex flex-col" style={{ gap: 6 }}>
            {(trending ?? []).slice(0, 10).map((tag, i) => (
              <Link
                key={tag.id}
                to={buildRoute.tag(tag.slug)}
                className="flex items-center hover:text-ink text-ink-2 transition-colors"
                style={{ fontSize: 13, gap: 10 }}
              >
                <span className="font-mono text-ink-3" style={{ fontSize: 10, minWidth: 16 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>#{tag.name}</span>
                {'blogCount' in tag && (tag as { blogCount?: number }).blogCount != null && (
                  <span className="font-mono text-ink-3 ml-auto" style={{ fontSize: 10 }}>
                    {(tag as { blogCount?: number }).blogCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-line" style={{ marginTop: 24, paddingTop: 18 }}>
            <div
              className="font-mono uppercase text-ink-3"
              style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 10 }}
            >
              Browse by letter
            </div>
            <div className="flex flex-wrap" style={{ gap: 4 }}>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
                const hasMatch = (allTags ?? []).some((t) =>
                  t.name.toUpperCase().startsWith(letter),
                )
                return (
                  <button
                    key={letter}
                    onClick={() => setQuery(letter.toLowerCase())}
                    className={`font-mono rounded-[3px] transition-colors ${
                      hasMatch
                        ? 'border border-line text-ink-2 hover:border-line-strong hover:text-ink'
                        : 'text-ink-3 cursor-default'
                    }`}
                    style={{ width: 26, height: 26, fontSize: 11 }}
                    disabled={!hasMatch}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
