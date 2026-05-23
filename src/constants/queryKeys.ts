// All TanStack Query key arrays live here. Never hardcode key strings elsewhere.
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },

  AUTHOR_PROFILES: {
    ME: ['author-profiles', 'me'] as const,
    BY_USERNAME: (username: string) => ['author-profiles', username] as const,
    BLOGS: (username: string) => ['author-profiles', username, 'blogs'] as const,
  },

  BLOGS: {
    MINE: ['blogs', 'mine'] as const,
    BY_SLUG: (slug: string) => ['blogs', slug] as const,
    EXPLORE: (filters: Record<string, unknown>) => ['blogs', 'explore', filters] as const,
    COMPANY: (handle: string) => ['blogs', 'company', handle] as const,
  },

  COMPANIES: {
    MINE: ['companies', 'mine'] as const,
    BY_HANDLE: (handle: string) => ['companies', handle] as const,
    MEMBERS: (handle: string) => ['companies', handle, 'members'] as const,
    MILESTONES: (handle: string) => ['companies', handle, 'milestones'] as const,
  },

  TAGS: {
    LIST: ['tags'] as const,
    TRENDING: ['tags', 'trending'] as const,
    BY_SLUG: (slug: string) => ['tags', slug] as const,
  },

  STATS: ['stats'] as const,

  ADMIN: {
    STATS:        ['admin', 'stats'] as const,
    MODERATION:   ['admin', 'moderation'] as const,
    FEATURED:     ['admin', 'featured'] as const,
    TAGS:         ['admin', 'tags'] as const,
    USERS:        ['admin', 'users'] as const,
    COMPANIES:    ['admin', 'companies'] as const,
    REPORTS:      ['admin', 'reports'] as const,
    AUDIT_LOG:    ['admin', 'audit-log'] as const,
  },
} as const
