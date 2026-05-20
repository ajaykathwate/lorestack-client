import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 px-4 text-center',
        className,
      )}
    >
      {icon && (
        <div className="text-ink-4 text-[32px] mb-1">{icon}</div>
      )}
      <p className="text-[14px] font-medium text-ink">{title}</p>
      {description && (
        <p className="text-[13px] text-ink-3 max-w-[320px] leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
