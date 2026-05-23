import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, Tag as TagIcon, User, Building2 } from 'lucide-react'
import { useSearch } from '@/api/hooks/useSearchQuery'
import { buildRoute } from '@/constants/routes'
import { articleTypeLabel } from '@/lib/utils'
import type { SearchType } from '@/types/api'

type FilterTab = 'all' | 'articles' | 'authors' | 'tags' | 'companies'

interface SearchModalProps {
  onClose: () => void
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 300)
  const q = debouncedQuery.trim()

  const searchType: SearchType = activeTab === 'all' ? 'all' : activeTab === 'articles' ? 'articles' : activeTab === 'authors' ? 'authors' : activeTab === 'tags' ? 'all' : 'companies'
  const { data, isFetching } = useSearch(q, searchType)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const blogs = data?.blogs ?? []
  const authors = data?.authors ?? []
  const tags = data?.tags ?? []
  const companies = data?.companies ?? []

  // Filter tags client-side from response (they come back in 'all' query)
  const filteredTags = activeTab === 'tags'
    ? (data?.tags ?? []).filter((t) => t.name.toLowerCase().includes(q.toLowerCase()) || t.slug.includes(q.toLowerCase()))
    : tags

  const showBlogs = activeTab === 'all' || activeTab === 'articles'
  const showAuthors = activeTab === 'all' || activeTab === 'authors'
  const showTags = activeTab === 'all' || activeTab === 'tags'
  const showCompanies = activeTab === 'all' || activeTab === 'companies'

  const totalCount = (showBlogs ? blogs.length : 0) + (showAuthors ? authors.length : 0) + (showTags ? filteredTags.length : 0) + (showCompanies ? companies.length : 0)
  const hasQuery = q.length >= 2

  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: null },
    { key: 'articles', label: 'Articles', icon: <FileText size={11} /> },
    { key: 'authors', label: 'Authors', icon: <User size={11} /> },
    { key: 'tags', label: 'Tags', icon: <TagIcon size={11} /> },
    { key: 'companies', label: 'Companies', icon: <Building2 size={11} /> },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center"
      style={{ paddingTop: 72, background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-[10px] border border-line shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 720, maxHeight: '82vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-line" style={{ padding: '16px 18px', gap: 12 }}>
          <Search size={16} className="text-ink-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, authors, tags, companies…"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-3 focus:outline-none"
            style={{ fontSize: 16 }}
          />
          {isFetching && hasQuery && (
            <div className="w-4 h-4 rounded-full border-2 border-ink-3 border-t-transparent animate-spin flex-shrink-0" />
          )}
          <kbd
            onClick={onClose}
            className="border border-line rounded-[3px] text-ink-3 cursor-pointer hover:bg-bg-tint font-mono flex-shrink-0"
            style={{ padding: '2px 7px', fontSize: 11 }}
          >
            esc
          </kbd>
        </div>

        {/* Tabs — only shown when there's a query */}
        {hasQuery && (
          <div className="flex border-b border-line" style={{ padding: '0 18px', gap: 2 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center font-sans transition-colors"
                style={{
                  padding: '9px 11px',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? 'var(--ls-ink)' : 'var(--ls-ink-3)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--ls-accent)' : '2px solid transparent',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="overflow-auto flex-1">
          {/* Empty state — no query yet */}
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center text-center" style={{ padding: '52px 32px', gap: 10 }}>
              <Search size={28} className="text-ink-3" />
              <p className="text-ink-2 font-serif" style={{ fontSize: 15 }}>
                Start typing to search
              </p>
              <p className="text-ink-3" style={{ fontSize: 12 }}>
                Find articles, authors, tags, and companies on Lorestack
              </p>
            </div>
          )}

          {/* No results */}
          {hasQuery && totalCount === 0 && !isFetching && (
            <div className="flex items-center justify-center text-ink-3" style={{ padding: '48px 32px', fontSize: 13 }}>
              No results for "<strong className="text-ink">{q}</strong>"
            </div>
          )}

          {/* Results sections */}
          {hasQuery && totalCount > 0 && (
            <>
              {/* Articles */}
              {showBlogs && blogs.length > 0 && (
                <div>
                  <div className="font-mono uppercase text-ink-3 border-b border-line sticky top-0 bg-bg flex items-center justify-between" style={{ fontSize: 10, letterSpacing: '1.2px', padding: '8px 18px' }}>
                    <span>Articles</span>
                    <Link to="/explore" onClick={onClose} className="text-ls-accent normal-case tracking-normal font-sans" style={{ fontSize: 11 }}>
                      See all →
                    </Link>
                  </div>
                  {blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      to={buildRoute.blog(blog.slug)}
                      onClick={onClose}
                      className="flex items-center hover:bg-bg-tint transition-colors"
                      style={{ gap: 12, padding: '11px 18px', borderBottom: '1px solid var(--ls-line-soft)' }}
                    >
                      <FileText size={14} className="text-ink-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-serif font-semibold text-ink truncate" style={{ fontSize: 13, lineHeight: 1.3 }}>
                          {blog.title}
                        </div>
                        <div className="text-ink-3 flex items-center" style={{ fontSize: 11, gap: 6, marginTop: 2 }}>
                          <span>{articleTypeLabel(blog.articleType)}</span>
                          {blog.readingTimeMinutes && <span>· {blog.readingTimeMinutes} min read</span>}
                          {blog.authorProfile && <span>· {blog.authorProfile.displayName}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Authors */}
              {showAuthors && authors.length > 0 && (
                <div>
                  <div className="font-mono uppercase text-ink-3 border-b border-line sticky top-0 bg-bg" style={{ fontSize: 10, letterSpacing: '1.2px', padding: '8px 18px' }}>
                    Authors
                  </div>
                  {authors.map((author) => (
                    <Link
                      key={author.id}
                      to={buildRoute.author(author.username)}
                      onClick={onClose}
                      className="flex items-center hover:bg-bg-tint transition-colors"
                      style={{ gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--ls-line-soft)' }}
                    >
                      {author.avatarUrl ? (
                        <img src={author.avatarUrl} alt={author.displayName} className="rounded-full object-cover flex-shrink-0" style={{ width: 32, height: 32 }} />
                      ) : (
                        <div className="rounded-full bg-bg-tint border border-line flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                          <User size={14} className="text-ink-3" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink" style={{ fontSize: 13 }}>{author.displayName}</div>
                        <div className="font-mono text-ink-3" style={{ fontSize: 11 }}>@{author.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Tags */}
              {showTags && filteredTags.length > 0 && (
                <div>
                  <div className="font-mono uppercase text-ink-3 border-b border-line sticky top-0 bg-bg" style={{ fontSize: 10, letterSpacing: '1.2px', padding: '8px 18px' }}>
                    Tags
                  </div>
                  <div className="flex flex-wrap" style={{ padding: '12px 18px', gap: 8 }}>
                    {filteredTags.map((tag) => (
                      <Link
                        key={tag.id}
                        to={buildRoute.tag(tag.slug)}
                        onClick={onClose}
                        className="flex items-center border border-line text-ink-2 rounded-full hover:border-line-strong hover:text-ink transition-colors"
                        style={{ gap: 5, padding: '4px 12px', fontSize: 12 }}
                      >
                        <TagIcon size={10} className="text-ink-3" />
                        {tag.name}
                        {tag.blogCount > 0 && (
                          <span className="font-mono text-ink-3" style={{ fontSize: 10 }}>· {tag.blogCount}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies */}
              {showCompanies && companies.length > 0 && (
                <div>
                  <div className="font-mono uppercase text-ink-3 border-b border-line sticky top-0 bg-bg" style={{ fontSize: 10, letterSpacing: '1.2px', padding: '8px 18px' }}>
                    Companies
                  </div>
                  {companies.map((company) => (
                    <Link
                      key={company.id}
                      to={buildRoute.company(company.handle)}
                      onClick={onClose}
                      className="flex items-center hover:bg-bg-tint transition-colors"
                      style={{ gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--ls-line-soft)' }}
                    >
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="rounded-[4px] object-cover flex-shrink-0" style={{ width: 32, height: 32 }} />
                      ) : (
                        <div className="rounded-[4px] bg-bg-tint border border-line flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                          <Building2 size={14} className="text-ink-3" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink" style={{ fontSize: 13 }}>{company.name}</div>
                        <div className="text-ink-3 flex items-center" style={{ gap: 4, fontSize: 11 }}>
                          <span className="font-mono">@{company.handle}</span>
                          {company.industry && <span>· {company.industry}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
