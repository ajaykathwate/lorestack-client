import type { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'main'
}

export function PageContainer({ children, className, style, as: Tag = 'div' }: PageContainerProps) {
  return (
    <Tag
      className={cn('px-4 sm:px-8 lg:px-12', className)}
      style={style}
    >
      {children}
    </Tag>
  )
}
