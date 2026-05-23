export type SearchType = 'all' | 'articles' | 'authors' | 'tags' | 'companies'

export interface SearchAuthor {
  id: string
  displayName: string
  username: string
  avatarUrl: string | null
  bio: string | null
  expertiseTags: string[]
}

export interface SearchCompany {
  id: string
  name: string
  handle: string
  tagline: string
  logoUrl: string | null
  industry: string | null
  stage: string | null
}

export interface SearchResult {
  blogs: import('./blog').BlogSummary[]
  authors: SearchAuthor[]
  companies: SearchCompany[]
  tags: import('./tag').Tag[]
}
