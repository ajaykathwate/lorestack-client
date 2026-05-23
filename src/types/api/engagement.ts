export interface BlogEngagement {
  totalViews: number
  uniqueViews: number
  likesCount: number
  savesCount: number
  sharesCount: number
  avgCompletionRate: number
  trendingScore: number
}

export interface MyEngagement {
  isLiked: boolean
  isSaved: boolean
}

export interface HomePayload {
  featuredArticle: import('./blog').BlogSummary | null
  trendingArticles: import('./blog').BlogSummary[]
  recentDeepDives: import('./blog').BlogSummary[]
  trendingTags: import('./tag').Tag[]
  stats: import('./stats').HomeStats
}
