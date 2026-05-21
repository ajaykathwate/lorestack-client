import { NavLink, Outlet, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/authStore'
import { initials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const SIDEBAR_ITEMS = [
  { label: 'Overview',    icon: '⌂', to: ROUTES.ADMIN_OVERVIEW,   exact: true },
  { label: 'Featured',    icon: '★', to: ROUTES.ADMIN_FEATURED },
  { label: 'Moderation',  icon: '⚑', to: ROUTES.ADMIN_MODERATION },
  { label: 'Tags',        icon: '#', to: ROUTES.ADMIN_TAGS },
  { label: 'Users',       icon: '◐', to: ROUTES.ADMIN_USERS },
  { label: 'Companies',   icon: '◧', to: ROUTES.ADMIN_COMPANIES },
  { label: 'Reports',     icon: '∿', to: ROUTES.ADMIN_REPORTS },
]

export function AdminLayout() {
  const { authorProfile } = useAuthStore()
  const avatarInitials = authorProfile?.displayName ? initials(authorProfile.displayName) : 'OP'

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      {/* Dark admin topbar */}
      <div
        className="flex items-center flex-shrink-0 border-b"
        style={{ background: 'var(--ls-ink)', borderColor: 'rgba(255,255,255,0.1)', padding: '10px 24px', gap: 14, height: 48 }}
      >
        <Link to={ROUTES.ADMIN_OVERVIEW} style={{ textDecoration: 'none' }}>
          <span className="font-serif font-bold" style={{ fontSize: 14, color: 'var(--ls-bg)' }}>
            Lorestack{' '}
            <span style={{ opacity: 0.5, fontWeight: 400 }}>· Admin</span>
          </span>
        </Link>

        <span
          className="font-mono rounded-[3px]"
          style={{ fontSize: 10, padding: '2px 7px', background: 'var(--ls-accent)', color: '#fff', letterSpacing: '0.4px', textTransform: 'uppercase' }}
        >
          Internal
        </span>

        <div className="flex-1" />

        <Link
          to={ROUTES.DASHBOARD}
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
          className="hover:text-white transition-colors"
        >
          ← Back to dashboard
        </Link>

        <div
          className="rounded-full flex items-center justify-center font-mono font-semibold"
          style={{ width: 26, height: 26, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontSize: 10, border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {avatarInitials}
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav
          className="flex-shrink-0 border-r border-line bg-bg-soft flex flex-col"
          style={{ width: 200, padding: '16px 0', overflowY: 'auto' }}
        >
          <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', padding: '0 16px 8px' }}>
            Admin
          </div>
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 font-sans transition-colors',
                  isActive
                    ? 'bg-bg text-ink font-semibold border-r-2 border-ls-accent'
                    : 'text-ink-2 hover:bg-bg hover:text-ink',
                )
              }
              style={{ fontSize: 13, padding: '8px 16px' }}
            >
              <span className="font-mono text-ink-3" style={{ fontSize: 12, width: 14, textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
