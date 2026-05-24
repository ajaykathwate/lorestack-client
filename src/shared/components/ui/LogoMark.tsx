import { useId } from 'react'

interface LogoMarkProps {
  size?: number
  className?: string
}

/**
 * The Lorestack mark — three stacked bars shaped like an L, with a gradient
 * tile and accent dot. Matches the canonical design in docs/claude_design/Lorestack Logo.html.
 *
 * Uses React useId() to ensure gradient IDs are unique per instance.
 */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  const id = useId().replace(/:/g, '')
  const gPrimary = `lm-g-primary-${id}`
  const gShade = `lm-g-shade-${id}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gPrimary} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#5b3df5" />
          <stop offset="55%"  stopColor="#7c4ae0" />
          <stop offset="100%" stopColor="#ff6a3d" />
        </linearGradient>
        <linearGradient id={gShade} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#fff" stopOpacity=".15" />
          <stop offset="100%" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>

      {/* Gradient tile */}
      <rect x="0" y="0" width="64" height="64" rx="14" fill={`url(#${gPrimary})`} />
      <rect x="0" y="0" width="64" height="64" rx="14" fill={`url(#${gShade})`} />

      {/* Three stacked bars — the L */}
      <rect x="16" y="16" width="10" height="8" rx="3" fill="#fff" fillOpacity=".95" />
      <rect x="16" y="28" width="18" height="8" rx="3" fill="#fff" fillOpacity=".95" />
      <rect x="16" y="40" width="32" height="8" rx="3" fill="#fff" />

      {/* Accent dot */}
      <circle cx="48" cy="20" r="3.2" fill="#fff" fillOpacity=".9" />
    </svg>
  )
}
