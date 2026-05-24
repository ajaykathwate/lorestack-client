import { Avatar, AvatarImage, AvatarFallback } from './avatar'
import { initials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  avatarUrl?: string | null
  name?: string | null
  size?: number
  shape?: 'circle' | 'square'
  className?: string
}

export function UserAvatar({ avatarUrl, name, size = 20, shape = 'circle', className }: UserAvatarProps) {
  const text = initials(name ?? '?')
  const fontSize = Math.max(7, Math.round(size * 0.38))
  const radius = shape === 'square' ? '6px' : '9999px'

  return (
    <Avatar
      className={cn('flex-shrink-0', className)}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? ''} className="object-cover" style={{ borderRadius: radius }} />}
      <AvatarFallback
        className="bg-bg-tint border border-line font-mono font-bold text-ink-2"
        style={{ fontSize, borderRadius: radius }}
      >
        {text}
      </AvatarFallback>
    </Avatar>
  )
}
