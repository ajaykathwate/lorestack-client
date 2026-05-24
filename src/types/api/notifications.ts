export type NotificationType =
  | 'author_followed'
  | 'company_followed'
  | 'blog_liked'
  | 'blog_saved'
  | 'blog_shared'
  | 'blog_published_fan_out'
  | 'company_invite_received'
  | 'company_invite_accepted'
  | 'company_invite_declined'
  | 'company_milestone'

export interface NotificationAction {
  label: string
  style: 'primary' | 'secondary'
  method: 'POST'
  url: string
}

export interface NotificationMetadata {
  actor?: { id?: string; username?: string; displayName?: string; avatarUrl?: string }
  author?: { id?: string; username?: string; displayName?: string; avatarUrl?: string }
  blog?: { id?: string; slug?: string; title?: string }
  company?: { id?: string; handle?: string; name?: string; logoUrl?: string }
  actions?: NotificationAction[]
  [key: string]: unknown
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  actorId?: string
  entityId?: string
  entityType?: 'blog' | 'company' | 'author' | 'tag'
  metadata?: NotificationMetadata
  createdAt: string
}

/** Shape pushed over WebSocket — id may be absent on arrival but backend persists it */
export type NotificationPush = Omit<Notification, 'id' | 'isRead' | 'createdAt'> & {
  id?: string
  isRead?: boolean
  createdAt?: string
}

export interface NotificationListMeta {
  page: number
  limit: number
  total: number
  hasNextPage: boolean
}

export interface NotificationListResponse {
  data: Notification[]
  meta: NotificationListMeta
}

export interface UnreadCountResponse {
  count: number
}

export interface DeleteAllResponse {
  deleted: number
}
