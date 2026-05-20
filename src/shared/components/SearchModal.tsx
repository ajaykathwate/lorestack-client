import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useExplore } from '@/api/hooks/useBlogQueries'
import { useTags } from '@/api/hooks/useTagQueries'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel } from '@/lib/utils'

type FilterTab = 'all' | 'blogs' | 'tags'

interface SearchModalProps {
  onClose: () => void
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: blogs } = useExplore()
  const { data: allTags } = useTags()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const q = query.trim().toLowerCase()

  const filteredBlogs = (blogs ?? []).filter(
    (b) => !q || b.title.toLowerCase().includes(q) || b.summary?.toLowerCase().includes(q),
  ).slice(0, 4)

  const filteredTags = (allTags ?? []).filter(
    (t) => !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
  ).slice(0, 6)

  const totalCount = filteredBlogs.length + filteredTags.length

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalCount },
    { key: 'blogs', label: 'Blogs', count: filteredBlogs.length },
    { key: 'tags', label: 'Tags', count: filteredTags.length },
  ]

  const showBlogs = activeTab === 'all' || activeTab === 'blogs'
  const showTags = activeTab === 'all' || activeTab === 'tags'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center"
      style={{ paddingTop: 80, background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-[8px] border border-line shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 600, maxHeight: '70vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-line" style={{ padding: '14px 16px', gap: 10 }}>
          <span className="text-ink-3 font-mono" style={{ fontSize: 16 }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Lorestack — blogs, tags…"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-3 focus:outline-none"
            style={{ fontSize: 15 }}
          />
          <kbd
            onClick={onClose}
            className="border border-line rounded-[3px] text-ink-3 cursor-pointer hover:bg-bg-tint font-mono"
            style={{ padding: '2px 6px', fontSize: 11 }}
          >
            esc
          </kbd>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line" style={{ padding: '0 16px', gap: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="font-sans transition-colors"
              style={{
                padding: '8px 10px',
                fontSize: 12,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
                borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 rounded-full font-mono ${
                    activeTab === tab.key ? 'bg-ink text-bg' : 'bg-bg-tint text-ink-3'
                  }`}
                  style={{ fontSize: 10, padding: '1px 6px' }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="overflow-auto flex-1">
          {totalCount === 0 && q ? (
            <div className="flex items-center justify-center text-ink-3" style={{ padding: 40, fontSize: 13 }}>
              No results for "<strong>{query}</strong>"
            </div>
          ) : totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center text-center" style={{ padding: 40, gap: 6 }}>
              <span className="text-ink-3 font-mono" style={{ fontSize: 24 }}>⌕</span>
              <p className="text-ink-3" style={{ fontSize: 13 }}>
                Search blogs and tags on Lorestack.
              </p>
            </div>
          ) : (
            <>
              {/* Blogs */}
              {showBlogs && filteredBlogs.length > 0 && (
                <div>
                  <div
                    className="font-mono uppercase text-ink-3 border-b border-line sticky top-0 bg-bg"
                    style={{ fontSize: 10, letterSpacing: '1.2px', padding: '8px 16px' }}
                  >
                    Blogs
                    {filteredBlogs.length > 0 && (
                      <Link
                        to="/explore"
                        onClick={onClose}
                        className="float-right text-ls-accent underline underline-offset-2 normal-case tracking-normal"
                        style={{ fontSize: 11 }}
                      >
                        See all →
                      </Link>
                    )}
                  </div>
                  {filteredBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      to={buildRoute.blog(blog.slug)}
                      onClick={onClose}
                      className="flex items-center hover:bg-bg-tint transition-colors"
                      style={{ gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--ls-line-soft)' }}
                    >
                      <span className="text-ink-3 font-mono flex-shrink-0" style={{ fontSize: 14 }}>◈</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif font-semibold text-ink truncate" style={{ fontSize: 13, lineHeight: 1.3 }}>
                          {blog.title}
                        </div>
                        <div className="text-ink-3 flex items-center" style={{ fontSize: 11, gap: 6, marginTop: 2 }}>
                          <span>{articleTypeLabel(blog.articleType)}</span>
                        </div>
                      </div>
                      <kbd className="text-ink-3 font-mono flex-shrink-0" style={{ fontSize: 10 }}>↵</kbd>
                    </Link>
                  ))}
                </div>
              )}

              {/* Tags */}
              {showTags && filteredTags.length > 0 && (
                <div>
                  <div
                    className="font-mono uppercase text-ink-3 border-b border-line"
                    style={{ fontSize: 10, letterSpacing: '1.2px', padding: '8px 16px' }}
                  >
                    Tags
                  </div>
                  <div className="flex flex-wrap" style={{ padding: '10px 16px', gap: 6 }}>
                    {filteredTags.map((tag) => (
                      <Link
                        key={tag.id}
                        to={buildRoute.tag(tag.slug)}
                        onClick={onClose}
                        className="border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors"
                        style={{ padding: '4px 12px', fontSize: 12 }}
                      >
                        #{tag.name}
                        {'blogCount' in tag && (tag as { blogCount?: number }).blogCount != null && (
                          <span className="font-mono text-ink-3 ml-1" style={{ fontSize: 10 }}>
                            · {(tag as { blogCount?: number }).blogCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="border-t border-line flex items-center text-ink-3"
          style={{ padding: '8px 16px', gap: 16, fontSize: 11 }}
        >
          <span className="font-mono flex items-center" style={{ gap: 4 }}>
            <kbd className="border border-line rounded-[2px] bg-bg-tint" style={{ padding: '1px 5px' }}>↑</kbd>
            <kbd className="border border-line rounded-[2px] bg-bg-tint" style={{ padding: '1px 5px' }}>↓</kbd>
            {' '}navigate
          </span>
          <span className="font-mono flex items-center" style={{ gap: 4 }}>
            <kbd className="border border-line rounded-[2px] bg-bg-tint" style={{ padding: '1px 5px' }}>↵</kbd>
            {' '}open
          </span>
          <span className="flex-1" />
          <span className="font-mono">powered by /search · {q && `view all results →`}</span>
        </div>
      </div>
    </div>
  )
}
