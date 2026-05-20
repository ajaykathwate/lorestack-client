import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function SkeletonLine({ className }: { className?: string }) {
  return <Skeleton className={cn('h-[14px] rounded-[4px]', className)} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-[6px] border border-line bg-bg p-4 flex flex-col gap-3', className)}>
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-1/2" />
    </div>
  )
}

export function SkeletonAvatar({ size = 32 }: { size?: number }) {
  return (
    <Skeleton
      className="rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
    />
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
