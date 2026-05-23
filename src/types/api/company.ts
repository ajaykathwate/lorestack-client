export type CompanyRole = 'owner' | 'author'

export type MilestoneType =
  | 'launch'
  | 'user_milestone'
  | 'infra_update'
  | 'funding'
  | 'feature_release'
  | 'bug_fixed'
  | 'partnership'
  | 'hiring'
  | 'experiment'
  | 'other'

export type Industry = string // backend accepts free-form like 'dev_tools'

export interface Company {
  id: string
  createdByUserId: string
  name: string
  handle: string
  tagline: string
  websiteUrl?: string | null
  logoUrl?: string | null
  coverImageUrl?: string | null
  industry?: Industry | null
  stage?: string | null
  techStack: string[]
  founderSocialLink?: string | null
  galleryImages?: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyMember {
  id: string
  userId: string
  role: CompanyRole
  joinedAt: string
  displayName: string
  username: string
  avatarUrl: string | null
}

export interface CompanyMilestone {
  id: string
  companyId: string
  type: MilestoneType
  headline: string
  description?: string | null
  impactMetric?: string | null
  milestoneDate: string
  createdAt: string
}

// ── Request payloads ──────────────────────────────────────────────────────────

export interface CreateCompanyPayload {
  name: string
  handle: string
  tagline: string
  websiteUrl?: string
  logoUrl?: string
  coverImageUrl?: string
  industry?: string
  stage?: string
  techStack?: string[]
  founderSocialLink?: string
  galleryImages?: string[]
  isPublic?: boolean
}

export interface UpdateCompanyPayload {
  name?: string
  tagline?: string
  websiteUrl?: string
  logoUrl?: string
  coverImageUrl?: string
  industry?: string
  stage?: string
  techStack?: string[]
  founderSocialLink?: string
  galleryImages?: string[]
  isPublic?: boolean
}

export interface InviteAuthorPayload {
  email: string
}

export interface AddMilestonePayload {
  type: MilestoneType
  headline: string
  description?: string
  impactMetric?: string
  milestoneDate: string
}
