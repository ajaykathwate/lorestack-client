import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  X, LayoutDashboard, BookOpen, FileText, Clock, Archive,
  Building2, Plus, User, UserCog, Settings, ShieldCheck,
  Link2, Mail, Trash2, ShieldAlert, Users, Bookmark, ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES, buildRoute } from '@/constants/routes'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { TopNav } from '@/shared/components/TopNav'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  Icon: LucideIcon
  external?: boolean
}

interface SectionDef {
  key: string
  label: string
  items: NavItem[]
  defaultOpen?: boolean
}

function buildSections(companyHandles: string[], username?: string, isAdmin?: boolean): SectionDef[] {
  const sections: SectionDef[] = [
    {
      key: 'writing',
      label: 'Writing',
      defaultOpen: true,
      items: [
        { label: 'Published',  to: ROUTES.MY_BLOGS,  Icon: BookOpen },
        { label: 'Drafts',     to: ROUTES.DRAFTS,    Icon: FileText },
        { label: 'Scheduled',  to: ROUTES.SCHEDULED, Icon: Clock },
        { label: 'Archived',   to: ROUTES.ARCHIVED,  Icon: Archive },
      ],
    },
    {
      key: 'library',
      label: 'Library',
      defaultOpen: true,
      items: [
        { label: 'Following', to: ROUTES.FOLLOWING, Icon: Users },
        { label: 'Saved',     to: ROUTES.SAVED,     Icon: Bookmark },
      ],
    },
    {
      key: 'companies',
      label: 'Companies',
      defaultOpen: true,
      items: [
        ...companyHandles.map<NavItem>((handle) => ({
          label: handle,
          to: buildRoute.companyDashboard(handle),
          Icon: Building2,
        })),
        { label: 'Create company', to: ROUTES.CREATE_COMPANY, Icon: Plus },
      ],
    },
    {
      key: 'you',
      label: 'You',
      defaultOpen: true,
      items: [
        {
          label: 'Profile',
          to: username ? buildRoute.author(username) : ROUTES.PROFILE_SETTINGS,
          Icon: User,
          external: true,
        },
      ],
    },
    {
      key: 'settings',
      label: 'Settings',
      defaultOpen: false, // collapsed by default
      items: [
        { label: 'My profile',         to: ROUTES.PROFILE_SETTINGS,   Icon: UserCog },
        { label: 'Account',            to: ROUTES.SETTINGS_ACCOUNT,   Icon: Settings },
        { label: 'Security',           to: ROUTES.SETTINGS_SECURITY,  Icon: ShieldCheck },
        { label: 'Connected accounts', to: ROUTES.SETTINGS_CONNECTED, Icon: Link2 },
        { label: 'Email preferences',  to: ROUTES.SETTINGS_EMAIL,     Icon: Mail },
        { label: 'Delete account',     to: ROUTES.SETTINGS_DELETE,    Icon: Trash2 },
      ],
    },
    ...(isAdmin ? [{
      key: 'platform',
      label: 'Platform',
      defaultOpen: false,
      items: [{ label: 'Admin panel', to: ROUTES.ADMIN_OVERVIEW, Icon: ShieldAlert as LucideIcon }],
    }] : []),
  ]
  return sections
}

function SidebarNav() {
  const { authorProfile, user } = useAuthStore()
  const isAdmin = user?.platformRole === 'platform_admin'
  const sections = buildSections([], authorProfile?.username, isAdmin)

  const initialOpen = Object.fromEntries(sections.map((s) => [s.key, s.defaultOpen ?? true]))
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(initialOpen)

  function toggle(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' }}>
      {/* Dashboard link — always visible, not in a section */}
      <NavLink
        to={ROUTES.DASHBOARD}
        end
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2.5 px-[10px] py-[7px] rounded-[4px] transition-colors border-l-2 mb-1',
            isActive
              ? 'bg-bg-soft text-ink font-semibold border-ls-accent'
              : 'text-ink-2 border-transparent hover:bg-bg-tint hover:text-ink',
          )
        }
        style={{ fontSize: 13 }}
      >
        <LayoutDashboard size={14} className="flex-shrink-0 text-ink-3" />
        <span>Dashboard</span>
      </NavLink>

      {sections.map((section) => {
        const isOpen = openSections[section.key] ?? true
        return (
          <div key={section.key} className="mt-3">
            {/* Section header — clickable to collapse */}
            <button
              onClick={() => toggle(section.key)}
              className="w-full flex items-center justify-between px-2 mb-1 group"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span
                className="font-mono uppercase text-ink-3 group-hover:text-ink-2 transition-colors"
                style={{ fontSize: 10, letterSpacing: '1.2px' }}
              >
                {section.label}
              </span>
              <ChevronDown
                size={11}
                className="text-ink-3 group-hover:text-ink-2 transition-all"
                style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
              />
            </button>

            {/* Collapsible items */}
            {isOpen && (
              <div className="flex flex-col gap-0">
                {section.items.map((item) => {
                  const Icon = item.Icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
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
                      <Icon size={14} className="flex-shrink-0 text-ink-3" />
                      <span className="flex-1 truncate">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            )}
          </div>
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

      <div className="flex flex-1 relative min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-ink/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — fixed height + internal scroll */}
        <aside
          className={cn(
            'fixed md:sticky top-[46px] z-50 flex flex-col border-r border-line bg-bg transition-transform duration-200 md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          style={{
            width: 'clamp(190px, 15vw, 224px)',
            height: 'calc(100vh - 46px)',
            overflowY: 'hidden',
          }}
        >
          {/* Mobile close button */}
          <div className="h-[46px] border-b border-line flex items-center justify-end px-4 md:hidden flex-shrink-0">
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
        <main className="flex-1 min-w-0 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
