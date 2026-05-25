import { articleTypeLabel } from '@/lib/utils'
import type { ArticleType } from '@/types/api'

interface ArticleTypeBadgeProps {
  type: ArticleType
  /** 'label' = plain text label (default), 'pill' = accent-coloured pill */
  variant?: 'label' | 'pill'
}

export function ArticleTypeBadge({ type, variant = 'label' }: ArticleTypeBadgeProps) {
  const label = articleTypeLabel(type)

  if (variant === 'pill') {
    return (
      <span
        className="bg-ls-accent text-white font-mono rounded-[3px]"
        style={{ fontSize: 10, padding: '2px 6px', letterSpacing: '0.4px' }}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className="font-mono text-ls-accent"
      style={{ fontSize: 10, letterSpacing: '0.4px' }}
    >
      {label}
    </span>
  )
}
