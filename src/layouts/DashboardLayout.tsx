import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  X, LayoutDashboard, BookOpen, Users, Bookmark, Building2,
  UserCog, Settings, ShieldCheck, Link2, Mail, Trash2,
  ShieldAlert, ChevronDown, UserRound,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { TopNav } from '@/shared/components/TopNav'
import { cn } from '@/lib/utils'

const SETTINGS_ITEMS = [
  { label: 'My profile',         to: ROUTES.PROFILE_SETTINGS,   Icon: UserCog },
  { label: 'Account',            to: ROUTES.SETTINGS_ACCOUNT,   Icon: Settings },
  { label: 'Security',           to: ROUTES.SETTINGS_SECURITY,  Icon: ShieldCheck },
  { label: 'Connected accounts', to: ROUTES.SETTINGS_CONNECTED, Icon: Link2 },
  { label: 'Email preferences',  to: ROUTES.SETTINGS_EMAIL,     Icon: Mail },
  { label: 'Delete account',     to: ROUTES.SETTINGS_DELETE,    Icon: Trash2 },
]

function NavItem({ to, label, Icon }: { to: string; label: string; Icon: React.ElementType }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-[10px] py-[7px] rounded-[4px] transition-colors border-l-2',
          isActive
            ? 'bg-bg-soft text-ink font-semibold border-ls-accent'
            : 'text-ink-2 border-transparent hover:bg-bg-tint hover:text-ink',
        )
      }
      style={{ fontSize: 13 }}
    >
      <Icon size={14} className="flex-shrink-0 text-ink-3" />
      <span className="flex-1 truncate">{label}</span>
    </NavLink>
  )
}

function SidebarNav() {
  const { user } = useAuthStore()
  const isAdmin = user?.platformRole === 'platform_admin'
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [platformOpen, setPlatformOpen] = useState(false)

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' }}>

      <NavItem to={ROUTES.DASHBOARD} label="Dashboard" Icon={LayoutDashboard} />
      <NavItem to={ROUTES.MY_BLOGS} label="My Blogs" Icon={BookOpen} />

      <div className="border-t border-line-soft" style={{ margin: '8px 8px' }} />

      <NavItem to={ROUTES.FOLLOWING} label="Following" Icon={Users} />
      <NavItem to={ROUTES.FOLLOWERS} label="Followers" Icon={Users} />
      <NavItem to={ROUTES.SAVED} label="Saved" Icon={Bookmark} />
      <NavItem to={ROUTES.MY_COMPANIES} label="Companies" Icon={Building2} />

      <NavItem to={ROUTES.MY_PUBLIC_PROFILE} label="View My Profile" Icon={UserRound} />

      <div className="border-t border-line-soft" style={{ margin: '8px 8px' }} />

      <CollapsibleSection
        label="Settings"
        isOpen={settingsOpen}
        onToggle={() => setSettingsOpen((v) => !v)}
      >
        {SETTINGS_ITEMS.map((item) => (
          <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} />
        ))}
      </CollapsibleSection>

      {isAdmin && (
        <CollapsibleSection
          label="Platform"
          isOpen={platformOpen}
          onToggle={() => setPlatformOpen((v) => !v)}
        >
          <NavItem to={ROUTES.ADMIN_OVERVIEW} label="Admin panel" Icon={ShieldAlert as React.ElementType} />
        </CollapsibleSection>
      )}
    </nav>
  )
}

function CollapsibleSection({
  label, isOpen, onToggle, children,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mt-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 mb-1 group"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span
          className="font-mono uppercase text-ink-3 group-hover:text-ink-2 transition-colors"
          style={{ fontSize: 10, letterSpacing: '1.2px' }}
        >
          {label}
        </span>
        <ChevronDown
          size={11}
          className="text-ink-3 group-hover:text-ink-2"
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
        />
      </button>
      {isOpen && (
        <div className="flex flex-col gap-0">
          {children}
        </div>
      )}
    </div>
  )
}

export function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = useUiStore()

  return (
    <div className="h-screen flex flex-col bg-bg font-sans">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
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
            'fixed md:sticky top-[46px] z-50 flex flex-col border-r border-line bg-bg transition-transform duration-200 md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          style={{
            width: 220,
            flexShrink: 0,
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
        <main className="flex-1 min-w-0 overflow-y-auto bg-bg p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
