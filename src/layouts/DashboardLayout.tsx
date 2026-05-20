import { Outlet, NavLink, Link } from 'react-router-dom'
import { PenLine, Bell, Menu, X } from 'lucide-react'
import { ROUTES, buildRoute } from '@/constants/routes'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { cn } from '@/lib/utils'

interface SidebarItem {
  type: 'heading' | 'link'
  label: string
  to?: string
  icon?: string
  count?: number
}

function buildSidebarItems(companyHandles: string[]): SidebarItem[] {
  return [
    { type: 'heading', label: 'Writing' },
    { type: 'link', label: 'Published', to: ROUTES.MY_BLOGS,  icon: '◆' },
    { type: 'link', label: 'Drafts',    to: ROUTES.DRAFTS,    icon: '◇' },
    { type: 'link', label: 'Scheduled', to: ROUTES.SCHEDULED, icon: '⏱' },

    { type: 'heading', label: 'Companies' },
    ...companyHandles.map<SidebarItem>((handle) => ({
      type: 'link',
      label: handle,
      to: buildRoute.companyDashboard(handle),
      icon: '◧',
    })),
    { type: 'link', label: '+ Create company', to: '/me/create-company', icon: '+' },

    { type: 'heading', label: 'You' },
    { type: 'link', label: 'Profile',       to: ROUTES.PROFILE_SETTINGS, icon: '☺' },
    { type: 'link', label: 'Notifications', to: ROUTES.NOTIFICATIONS,    icon: '⌗' },
  ]
}

function SidebarNav() {
  const items = buildSidebarItems([])

  return (
    <nav className="flex-1 py-3 px-2 flex flex-col gap-0">
      {items.map((item, i) => {
        if (item.type === 'heading') {
          return (
            <div
              key={`h-${i}`}
              className="font-mono uppercase text-ink-3 px-2 mt-4 mb-1 first:mt-0"
              style={{ fontSize: 10, letterSpacing: '1.2px' }}
            >
              {item.label}
            </div>
          )
        }
        return (
          <NavLink
            key={item.to}
            to={item.to!}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-[10px] py-[8px] rounded-[4px] transition-colors border-l-2',
                isActive
                  ? 'bg-bg-soft text-ink font-semibold border-ls-accent'
                  : 'text-ink-2 border-transparent hover:bg-bg-tint hover:text-ink',
              )
            }
            style={{ fontSize: 13 }}
          >
            <span className="font-mono text-ink-3 w-4 flex-shrink-0" style={{ fontSize: 11 }}>
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.count != null && (
              <span className="text-ink-3" style={{ fontSize: 11 }}>{item.count}</span>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

export function DashboardLayout() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUiStore()
  const { authorProfile } = useAuthStore()

  const initials = authorProfile?.displayName
    ? authorProfile.displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <div className="min-h-screen flex bg-bg-soft font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — 220px */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-bg transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        style={{ width: 220 }}
      >
        {/* Logo header */}
        <div className="h-[56px] border-b border-line flex items-center justify-between px-4">
          <Wordmark size={17} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-ink-3 hover:text-ink"
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>

        <SidebarNav />

        {/* Bottom user row */}
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[4px] hover:bg-bg-tint cursor-pointer transition-colors">
            <div
              className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 flex-shrink-0"
              style={{ width: 26, height: 26, fontSize: 10 }}
            >
              {initials}
            </div>
            <span className="text-ink-2 flex-1 truncate" style={{ fontSize: 13 }}>
              {authorProfile?.displayName ?? 'Account'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[56px] border-b border-line bg-bg flex items-center justify-between px-5 gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-ink-2 hover:text-ink"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2.5">
            <Link
              to={ROUTES.NOTIFICATIONS}
              className="text-ink-2 hover:text-ink transition-colors"
              title="Notifications"
            >
              <Bell size={17} />
            </Link>
            <Link
              to={ROUTES.EDITOR_NEW}
              className="flex items-center gap-1.5 bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              <PenLine size={14} />
              Write
            </Link>
            <Link to={ROUTES.PROFILE_SETTINGS}>
              <div
                className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 hover:border-line-strong transition-colors"
                style={{ width: 30, height: 30, fontSize: 11 }}
              >
                {initials}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
