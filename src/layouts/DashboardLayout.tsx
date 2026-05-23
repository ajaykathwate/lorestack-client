import { Outlet, NavLink } from 'react-router-dom'
import {
  X, LayoutDashboard, BookOpen, FileText, Clock, Archive,
  Building2, Plus, User, UserCog, Settings, ShieldCheck,
  Link2, Mail, Trash2, ShieldAlert, Users, Bookmark,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES, buildRoute } from '@/constants/routes'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { TopNav } from '@/shared/components/TopNav'
import { cn } from '@/lib/utils'

interface SidebarItem {
  type: 'heading' | 'link'
  label: string
  to?: string
  Icon?: LucideIcon
  count?: number
  external?: boolean
}

function buildSidebarItems(companyHandles: string[], username?: string, isAdmin?: boolean): SidebarItem[] {
  return [
    { type: 'link', label: 'Dashboard', to: ROUTES.DASHBOARD, Icon: LayoutDashboard },

    { type: 'heading', label: 'Writing' },
    { type: 'link', label: 'Published',  to: ROUTES.MY_BLOGS,  Icon: BookOpen },
    { type: 'link', label: 'Drafts',     to: ROUTES.DRAFTS,    Icon: FileText },
    { type: 'link', label: 'Scheduled',  to: ROUTES.SCHEDULED, Icon: Clock },
    { type: 'link', label: 'Archived',   to: ROUTES.ARCHIVED,  Icon: Archive },

    { type: 'heading', label: 'Library' },
    { type: 'link', label: 'Following',  to: ROUTES.FOLLOWING, Icon: Users },
    { type: 'link', label: 'Saved',      to: ROUTES.SAVED,     Icon: Bookmark },

    { type: 'heading', label: 'Companies' },
    ...companyHandles.map<SidebarItem>((handle) => ({
      type: 'link',
      label: handle,
      to: buildRoute.companyDashboard(handle),
      Icon: Building2,
    })),
    { type: 'link', label: 'Create company', to: ROUTES.CREATE_COMPANY, Icon: Plus },

    { type: 'heading', label: 'You' },
    {
      type: 'link',
      label: 'Profile',
      to: username ? buildRoute.author(username) : ROUTES.PROFILE_SETTINGS,
      Icon: User,
      external: true,
    },

    { type: 'heading', label: 'Settings' },
    { type: 'link', label: 'My profile',         to: ROUTES.PROFILE_SETTINGS,   Icon: UserCog },
    { type: 'link', label: 'Account',            to: ROUTES.SETTINGS_ACCOUNT,   Icon: Settings },
    { type: 'link', label: 'Security',           to: ROUTES.SETTINGS_SECURITY,  Icon: ShieldCheck },
    { type: 'link', label: 'Connected accounts', to: ROUTES.SETTINGS_CONNECTED, Icon: Link2 },
    { type: 'link', label: 'Email preferences',  to: ROUTES.SETTINGS_EMAIL,     Icon: Mail },

    { type: 'heading', label: 'Danger' },
    { type: 'link', label: 'Delete account', to: ROUTES.SETTINGS_DELETE, Icon: Trash2 },

    ...(isAdmin ? [
      { type: 'heading' as const, label: 'Platform' },
      { type: 'link' as const, label: 'Admin panel', to: ROUTES.ADMIN_OVERVIEW, Icon: ShieldAlert as LucideIcon },
    ] : []),
  ]
}

function SidebarNav() {
  const { authorProfile, user } = useAuthStore()
  const isAdmin = user?.platformRole === 'platform_admin'
  const items = buildSidebarItems([], authorProfile?.username, isAdmin)

  return (
    <nav className="flex-1 py-3 px-2 flex flex-col gap-0 overflow-y-auto">
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
        const Icon = item.Icon
        return (
          <NavLink
            key={`${item.to}-${i}`}
            to={item.to!}
            end={item.to === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-[10px] py-[7px] rounded-[4px] transition-colors border-l-2',
                isActive && !item.external
                  ? 'bg-bg-soft text-ink font-semibold border-ls-accent'
                  : 'text-ink-2 border-transparent hover:bg-bg-tint hover:text-ink',
              )
            }
            style={{ fontSize: 13 }}
          >
            {Icon && <Icon size={14} className="flex-shrink-0 text-ink-3" />}
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
  const { sidebarOpen, setSidebarOpen } = useUiStore()

  return (
    <div className="min-h-screen flex flex-col bg-bg-soft font-sans">
      <TopNav />

      <div className="flex flex-1 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-ink/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-bg transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}
          style={{ width: 'clamp(180px, 15vw, 220px)' }}
        >
          {/* Mobile close button */}
          <div className="h-[46px] border-b border-line flex items-center justify-end px-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-ink-3 hover:text-ink"
              aria-label="Close sidebar"
            >
              <X size={15} />
            </button>
          </div>

          <SidebarNav />
        </aside>

        {/* Main area */}
        <main className="flex-1 min-w-0 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
