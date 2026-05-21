// Admin-specific API types

export interface AdminStats {
  newUsers: number
  newBlogs: number
  newCompanies: number
  openReports: number
  newUsersChange: string
  newBlogsChange: string
  newCompaniesChange: string
}

export type ModerationItemType = 'report' | 'new_tag' | 'user_flag'
export type ModerationStatus = 'pending' | 'approved' | 'rejected'

export interface ModerationItem {
  id: string
  type: ModerationItemType
  title: string
  reason: string
  flag: string
  status: ModerationStatus
  createdAt: string
  reportCount?: number
}

export interface FeaturedCompany {
  id: string
  companyId: string
  name: string
  handle: string
  logoUrl?: string | null
  position: number
}

// Matches GET /tags response shape
export interface AdminTag {
  id: string
  name: string
  slug: string
  description?: string | null
  blogCount: number
  isApproved: boolean
  createdAt: string
}

// Matches GET /users response shape (admin-only endpoint)
export interface AdminUser {
  id: string
  email: string
  provider: 'LOCAL' | 'GOOGLE'
  platformRole: 'user' | 'platform_admin'
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  // Author profile fields — populated only if the user completed onboarding
  displayName?: string | null
  username?: string | null
}

export interface AdminCompany {
  id: string
  name: string
  handle: string
  logoUrl?: string | null
  isPublic: boolean
  memberCount: number
  blogCount: number
  createdAt: string
}

export interface AdminReport {
  id: string
  targetType: 'blog' | 'user' | 'company'
  targetId: string
  targetTitle: string
  reason: string
  reportCount: number
  status: 'open' | 'resolved' | 'dismissed'
  createdAt: string
}

export interface AuditLogEntry {
  id: string
  action: string
  performedBy: string
  createdAt: string
}
