import { Outlet, NavLink } from 'react-router-dom'
import { User, Settings, Bell, ShieldCheck, Link2, Mail, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { TopNav } from '@/shared/components/TopNav'
import { cn } from '@/lib/utils'

interface SettingsSidebarItem {
  type: 'heading' | 'link'
  label: string
  to?: string
  Icon?: LucideIcon
}

const SETTINGS_NAV: SettingsSidebarItem[] = [
  { type: 'heading', label: 'Settings' },
  { type: 'link', label: 'My profile',         to: ROUTES.PROFILE_SETTINGS,       Icon: User },
  { type: 'link', label: 'Account',            to: ROUTES.SETTINGS_ACCOUNT,       Icon: Settings },
  { type: 'link', label: 'Notifications',      to: ROUTES.SETTINGS_NOTIFICATIONS, Icon: Bell },
  { type: 'link', label: 'Security',           to: ROUTES.SETTINGS_SECURITY,      Icon: ShieldCheck },
  { type: 'link', label: 'Connected accounts', to: ROUTES.SETTINGS_CONNECTED,     Icon: Link2 },
  { type: 'link', label: 'Email preferences',  to: ROUTES.SETTINGS_EMAIL,         Icon: Mail },
  { type: 'heading', label: 'Danger zone' },
  { type: 'link', label: 'Delete account',     to: ROUTES.SETTINGS_DELETE,        Icon: Trash2 },
]

function SettingsSidebar() {
  return (
    <aside className="flex-shrink-0 border-r border-line bg-bg flex flex-col" style={{ width: 220 }}>
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0">
        {SETTINGS_NAV.map((item, i) => {
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
              {Icon && <Icon size={14} className="flex-shrink-0 text-ink-3" />}
              <span className="flex-1">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export function SettingsLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans">
      <TopNav />
      <div className="flex flex-1" style={{ minHeight: 0 }}>
        <SettingsSidebar />
        <main className="flex-1 overflow-auto" style={{ padding: '24px 40px', maxWidth: 880 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
