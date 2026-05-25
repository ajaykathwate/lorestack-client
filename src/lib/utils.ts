import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ArticleType, Notification, NotificationPush } from '@/types/api'
import { buildRoute } from '@/constants/routes'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const ARTICLE_TYPE_LABELS: Record<ArticleType, string> = {
  engineering_blog: 'Engineering blog',
  architecture_deep_dive: 'Architecture deep dive',
  case_study: 'Case study',
  scaling_story: 'Scaling story',
  failure_postmortem: 'Postmortem',
  ai_experiment: 'AI experiment',
  founder_note: 'Founder note',
  tutorial: 'Tutorial',
  opinion_essay: 'Opinion',
  project_showcase: 'Project showcase',
  open_source_release: 'Open source',
  other: 'Other',
}

export function articleTypeLabel(type: ArticleType): string {
  return ARTICLE_TYPE_LABELS[type] ?? type
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function timeGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Instagram-style short time: "2m", "5h", "3d", "2w" */
export function formatInstagramTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function notifDeepLink(n: Notification | NotificationPush): string | null {
  const meta = n.metadata
  switch (n.type) {
    case 'author_followed':
      return meta?.actor?.username ? buildRoute.author(meta.actor.username as string) : null
    case 'company_followed':
    case 'company_invite_accepted':
    case 'company_invite_declined':
    case 'company_milestone':
      return meta?.company?.handle ? buildRoute.company(meta.company.handle as string) : null
    case 'blog_liked':
    case 'blog_saved':
    case 'blog_shared':
    case 'blog_published_fan_out':
      return meta?.blog?.slug ? buildRoute.blog(meta.blog.slug as string) : null
    default:
      return null
  }
}

export function notifAvatar(n: Notification | NotificationPush): string | null {
  return (n.metadata?.actor?.avatarUrl ?? n.metadata?.author?.avatarUrl ?? null) as string | null
}

export function notifAvatarName(n: Notification | NotificationPush): string {
  return ((n.metadata?.actor?.displayName ?? n.metadata?.author?.displayName ?? '?') as string)
}
