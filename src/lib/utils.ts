import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ArticleType } from '@/types/api'

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
