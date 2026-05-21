import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PenLine, Search, Bell, LogOut, User, LayoutDashboard, Home, Settings, X } from 'lucide-react'
import { ROUTES, buildRoute } from '@/constants/routes'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/api/hooks/useAuthMutations'
import { SearchModal } from '@/shared/components/SearchModal'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Explore',   to: ROUTES.EXPLORE },
  { label: 'Tags',      to: ROUTES.TAGS },
  { label: 'Companies', to: ROUTES.COMPANIES },
]

// ── Notification drawer ──────────────────────────────────────────────────────

const NOTIF_TABS = ['All', 'Mentions', 'Companies', 'System'] as const
type NotifTab = typeof NOTIF_TABS[number]

function NotificationDrawer({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<NotifTab>('All')

  return (
    <div
      className="fixed z-50 bg-bg border border-line rounded-[6px] flex flex-col"
      style={{
        top: 62,
        right: 24,
        width: 380,
        maxHeight: 520,
        boxShadow: '0 12px 40px rgba(0,0,0,.18)',
      }}
    >
      {/* Header */}
      <div className="flex items-center px-4 border-b border-line-soft" style={{ padding: '12px 16px' }}>
        <span className="font-semibold text-ink" style={{ fontSize: 14 }}>Notifications</span>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="text-ink-3 hover:text-ink transition-colors"
          aria-label="Close notifications"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 px-4 py-2 border-b border-line-soft">
        {NOTIF_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'rounded-full border transition-colors font-sans',
              tab === t
                ? 'bg-ink text-bg border-ink'
                : 'bg-bg text-ink-2 border-line hover:border-line-strong',
            )}
            style={{ fontSize: 11, padding: '3px 10px' }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: 32, gap: 8 }}>
        <Bell size={24} className="text-ink-3" />
        <p className="font-semibold text-ink-2" style={{ fontSize: 13 }}>No notifications yet</p>
        <p className="text-ink-3" style={{ fontSize: 12 }}>
          {tab === 'All'
            ? "You're all caught up. We'll let you know when something happens."
            : `No ${tab.toLowerCase()} notifications yet.`}
        </p>
      </div>
    </div>
  )
}

// ── TopNav ───────────────────────────────────────────────────────────────────

export function TopNav() {
  const { isAuthenticated, authorProfile } = useAuthStore()
  const { mutate: logout } = useLogout()
  const location = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const avatarInitials = authorProfile?.displayName
    ? authorProfile.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const openSearch = useCallback(() => setShowSearch(true), [])
  const closeSearch = useCallback(() => setShowSearch(false), [])

  // ⌘K + Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true) }
      if (e.key === 'Escape') { setShowMenu(false); setShowNotif(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Close on route change
  useEffect(() => { setShowMenu(false); setShowNotif(false) }, [location.pathname])

  const profileHref = authorProfile?.username
    ? buildRoute.author(authorProfile.username)
    : ROUTES.PROFILE_SETTINGS

  return (
    <>
      {showSearch && <SearchModal onClose={closeSearch} />}

      {/* Notification drawer */}
      {showNotif && (
        <div ref={notifRef}>
          <NotificationDrawer onClose={() => setShowNotif(false)} />
        </div>
      )}

      <header className="sticky top-0 z-50 bg-bg border-b border-line">
        <div
          className="grid items-center gap-6 px-6"
          style={{ gridTemplateColumns: 'auto 1fr auto', height: 56 }}
        >
          {/* Left: wordmark + nav */}
          <div className="flex items-center gap-7">
            <Link to={ROUTES.HOME}>
              <Wordmark size={19} />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'pb-[2px] transition-colors',
                      isActive
                        ? 'font-semibold text-ink border-b-2 border-ls-accent'
                        : 'text-ink-2 hover:text-ink',
                    )
                  }
                  style={{ fontSize: 14 }}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: search */}
          <div className="max-w-[520px] w-full mx-auto hidden md:block">
            <div
              onClick={openSearch}
              className="flex items-center gap-2 border border-line bg-bg-soft rounded-[6px] text-ink-3 cursor-text hover:border-line-strong transition-colors"
              style={{ padding: '8px 12px', fontSize: 13 }}
            >
              <Search size={14} className="text-ink-2" />
              <span className="flex-1 text-ink-3" style={{ fontSize: 13 }}>
                Search Lorestack — blogs, companies, people, tags…
              </span>
              <span className="hidden lg:flex gap-1 font-mono text-ink-3" style={{ fontSize: 10 }}>
                <span className="border border-line-soft rounded-[3px] bg-bg" style={{ padding: '2px 5px' }}>⌘</span>
                <span className="border border-line-soft rounded-[3px] bg-bg" style={{ padding: '2px 5px' }}>K</span>
              </span>
            </div>
          </div>

          {/* Right: auth */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                {/* Bell → notification drawer */}
                <button
                  onClick={() => setShowNotif((v) => !v)}
                  className={cn(
                    'text-ink-2 hover:text-ink transition-colors p-1 rounded-[4px]',
                    showNotif && 'bg-bg-tint text-ink',
                  )}
                  title="Notifications"
                  aria-label="Open notifications"
                >
                  <Bell size={16} />
                </button>

                <Link
                  to={ROUTES.EDITOR_NEW}
                  className="flex items-center gap-1.5 bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  <PenLine size={14} />
                  Write
                </Link>

                {/* Avatar dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu((v) => !v)}
                    className={cn(
                      'rounded-full bg-bg-tint border flex items-center justify-center font-mono text-ink-2 transition-colors focus:outline-none',
                      showMenu ? 'border-ls-accent' : 'border-line hover:border-line-strong',
                    )}
                    style={{ width: 30, height: 30, fontSize: 11 }}
                    aria-label="Account menu"
                  >
                    {avatarInitials}
                  </button>

                  {showMenu && (
                    <div
                      className="absolute right-0 top-full mt-2 bg-bg border border-line rounded-[6px] z-50"
                      style={{ minWidth: 188, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}
                    >
                      {authorProfile && (
                        <div className="px-3 py-2.5 border-b border-line-soft">
                          <div className="font-semibold text-ink truncate" style={{ fontSize: 13 }}>
                            {authorProfile.displayName}
                          </div>
                          {authorProfile.username && (
                            <div className="text-ink-3 font-mono" style={{ fontSize: 11 }}>
                              @{authorProfile.username}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="py-1">
                        <Link
                          to={ROUTES.HOME}
                          className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                          style={{ fontSize: 13 }}
                        >
                          <Home size={13} className="flex-shrink-0" />
                          Home
                        </Link>
                        <Link
                          to={ROUTES.DASHBOARD}
                          className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                          style={{ fontSize: 13 }}
                        >
                          <LayoutDashboard size={13} className="flex-shrink-0" />
                          Dashboard
                        </Link>
                        {/* Profile → public author page */}
                        <Link
                          to={profileHref}
                          className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                          style={{ fontSize: 13 }}
                        >
                          <User size={13} className="flex-shrink-0" />
                          Profile
                        </Link>
                        <Link
                          to={ROUTES.PROFILE_SETTINGS}
                          className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                          style={{ fontSize: 13 }}
                        >
                          <Settings size={13} className="flex-shrink-0" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-line-soft py-1">
                        <button
                          onClick={() => { setShowMenu(false); logout() }}
                          className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors w-full text-left"
                          style={{ fontSize: 13 }}
                        >
                          <LogOut size={13} className="flex-shrink-0" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  state={{ from: location.pathname }}
                  className="font-medium text-ink-2 hover:text-ink hover:bg-bg-tint rounded-[6px] transition-colors"
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  Log in
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  state={{ from: location.pathname }}
                  className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
