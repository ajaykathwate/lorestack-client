export type ArticleType =
  | 'engineering_blog'
  | 'architecture_deep_dive'
  | 'case_study'
  | 'scaling_story'
  | 'failure_postmortem'
  | 'ai_experiment'
  | 'founder_note'
  | 'tutorial'
  | 'opinion_essay'
  | 'project_showcase'
  | 'open_source_release'
  | 'other'

export type BlogStatus = 'draft' | 'published' | 'scheduled' | 'archived' | 'publish_failed'

export interface BlogTag {
  id: string
  name: string
  slug: string
  isApproved: boolean
}

export interface BlogAuthorProfile {
  displayName: string
  username: string
  avatarUrl: string | null
}

export interface BlogCompany {
  name: string
  handle: string
  logoUrl: string | null
}

export interface Blog {
  id: string
  authorId: string
  companyId: string | null
  // Embedded by the backend on GET /blogs/:slug and list endpoints
  authorProfile?: BlogAuthorProfile | null
  company?: BlogCompany | null
  title: string
  slug: string
  body: string | null
  summary: string | null
  coverImageUrl: string | null
  ogImageUrl?: string | null
  articleType: ArticleType
  status: BlogStatus
  publishedAt: string | null
  scheduledAt: string | null
  seoTitleOverride: string | null
  seoDescOverride: string | null
  readingTimeMinutes: number | null
  tags: BlogTag[]
  createdAt: string
  updatedAt: string
}

// Summary omits body and SEO overrides (used in list endpoints)
export type BlogSummary = Omit<Blog, 'body' | 'seoTitleOverride' | 'seoDescOverride'>

// ── Request payloads ──────────────────────────────────────────────────────────

export interface CreateBlogPayload {
  title: string
  articleType: ArticleType
  body?: string
  companyId?: string
  summary?: string
  coverImageUrl?: string
  seoTitleOverride?: string
  seoDescOverride?: string
  tags?: string[]
}

export interface UpdateBlogPayload {
  title?: string
  body?: string
  summary?: string
  coverImageUrl?: string
  seoTitleOverride?: string
  seoDescOverride?: string
  tags?: string[]
  articleType?: ArticleType
}

export interface ScheduleBlogPayload {
  scheduledAt: string
  scheduledTimezone?: string
}

export interface ExploreParams {
  type?: ArticleType
  tag?: string
  companyId?: string
  dateRange?: 'week' | 'month' | '6months' | 'all'
  page?: number
  limit?: number
}
