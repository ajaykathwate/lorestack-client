import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  PenLine, Search, Bell, LogOut, User, LayoutDashboard, Home, Settings,
  X, Menu,
} from 'lucide-react'
import { toast } from 'sonner'
import { ROUTES, buildRoute } from '@/constants/routes'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { useAuthStore } from '@/store/authStore'
import { useNotificationsStore } from '@/store/notificationsStore'
import { useLogout } from '@/api/hooks/useAuthMutations'
import { useUnreadCount } from '@/api/hooks/useNotificationQueries'
import { notificationsSocket } from '@/lib/notificationsSocket'
import { SearchModal } from '@/shared/components/SearchModal'
import { NotificationDrawer } from '@/shared/components/NotificationDrawer'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/shared/components/ui/UserAvatar'

const NAV_LINKS = [
  { label: 'Explore',   to: ROUTES.EXPLORE },
  { label: 'Tags',      to: ROUTES.TAGS },
  { label: 'Companies', to: ROUTES.COMPANIES },
]

// ── TopNav ───────────────────────────────────────────────────────────────────

export function TopNav() {
  const { isAuthenticated, authorProfile } = useAuthStore()
  const { mutate: logout } = useLogout()
  const location = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const { unreadCount, setUnreadCount, incrementUnread, addLiveItem } = useNotificationsStore()
  const { data: serverCount } = useUnreadCount()

  // Initialize unread count from server once — WS events take over after that
  const countInitialized = useRef(false)
  useEffect(() => {
    if (serverCount !== undefined && !countInitialized.current) {
      countInitialized.current = true
      setUnreadCount(serverCount)
    }
  }, [serverCount, setUnreadCount])

  // Single WS subscription — TopNav is always mounted when authenticated.
  // NotificationsPage reads from the store; it does NOT subscribe separately.
  useEffect(() => {
    if (!isAuthenticated) return
    const unsub = notificationsSocket.subscribe((payload) => {
      addLiveItem(payload)
      incrementUnread()
      toast(payload.message, { description: payload.title, duration: 5000 })
    })
    return unsub
  }, [isAuthenticated, addLiveItem, incrementUnread])

  const openSearch = useCallback(() => setShowSearch(true), [])
  const closeSearch = useCallback(() => setShowSearch(false), [])

  // ⌘K + Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true) }
      if (e.key === 'Escape') { setShowMenu(false); setShowNotif(false); setMobileMenuOpen(false) }
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
  useEffect(() => {
    setShowMenu(false); setShowNotif(false); setMobileMenuOpen(false)
  }, [location.pathname])

  const profileHref = authorProfile?.username
    ? buildRoute.author(authorProfile.username)
    : ROUTES.PROFILE_SETTINGS

  return (
    <>
      {showSearch && <SearchModal onClose={closeSearch} />}

      {showNotif && (
        <div ref={notifRef}>
          <NotificationDrawer onClose={() => setShowNotif(false)} />
        </div>
      )}

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-bg overflow-auto flex flex-col"
          style={{ top: 56, boxShadow: '0 8px 32px rgba(0,0,0,.15)' }}
        >
          <nav className="flex flex-col p-3 gap-0.5 border-b border-line">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn('px-3 py-3 rounded-[4px] font-medium transition-colors',
                    isActive ? 'bg-bg-tint text-ink' : 'text-ink-2 hover:text-ink hover:bg-bg-tint')
                }
                style={{ fontSize: 15 }}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-col p-3 gap-2">
            {isAuthenticated ? (
              <>
                {authorProfile && (
                  <div className="flex items-center border border-line rounded-[6px] bg-bg-soft mb-1" style={{ gap: 10, padding: '10px 12px' }}>
                    <UserAvatar avatarUrl={authorProfile.avatarUrl} name={authorProfile.displayName} size={36} />
                    <div className="min-w-0">
                      <div className="font-semibold text-ink truncate" style={{ fontSize: 13 }}>{authorProfile.displayName}</div>
                      {authorProfile.username && (
                        <div className="text-ink-3 font-mono" style={{ fontSize: 11 }}>@{authorProfile.username}</div>
                      )}
                    </div>
                  </div>
                )}
                <Link
                  to={ROUTES.EDITOR_NEW}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
                  style={{ padding: '11px 16px', fontSize: 14 }}
                >
                  <PenLine size={15} /> Write
                </Link>
                {[
                  { to: ROUTES.DASHBOARD, Icon: LayoutDashboard, label: 'Dashboard' },
                  { to: ROUTES.HOME, Icon: Home, label: 'Home' },
                  { to: profileHref, Icon: User, label: 'Profile' },
                  { to: ROUTES.NOTIFICATIONS, Icon: Bell, label: 'Notifications' },
                  { to: ROUTES.PROFILE_SETTINGS, Icon: Settings, label: 'Settings' },
                ].map(({ to, Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-ink-2 hover:text-ink hover:bg-bg-tint rounded-[4px] transition-colors"
                    style={{ fontSize: 14 }}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    {label}
                    {label === 'Notifications' && unreadCount > 0 && (
                      <span className="ml-auto bg-ls-accent text-white rounded-full font-mono" style={{ fontSize: 10, padding: '1px 6px' }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
                <div className="border-t border-line-soft my-1" />
                <button
                  onClick={() => { setMobileMenuOpen(false); logout() }}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-ink-2 hover:text-ink hover:bg-bg-tint rounded-[4px] transition-colors w-full text-left"
                  style={{ fontSize: 14 }}
                >
                  <LogOut size={14} className="flex-shrink-0" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} state={{ from: location.pathname }} onClick={() => setMobileMenuOpen(false)}
                  className="border border-line text-ink font-medium rounded-[6px] text-center hover:bg-bg-tint transition-colors"
                  style={{ padding: '11px 16px', fontSize: 14 }}>
                  Log in
                </Link>
                <Link to={ROUTES.REGISTER} state={{ from: location.pathname }} onClick={() => setMobileMenuOpen(false)}
                  className="bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors text-center"
                  style={{ padding: '11px 16px', fontSize: 14 }}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-bg border-b border-line">
        <div
          className="grid items-center px-4 sm:px-6"
          style={{ gridTemplateColumns: 'auto 1fr auto', height: 56, gap: 'clamp(12px, 2vw, 24px)' }}
        >
          {/* Left */}
          <div className="flex items-center gap-5 lg:gap-7">
            <Wordmark size={19} />
            <nav className="hidden md:flex items-center gap-5 lg:gap-6">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => cn('pb-[2px] transition-colors whitespace-nowrap',
                    isActive ? 'font-semibold text-ink border-b-2 border-ls-accent' : 'text-ink-2 hover:text-ink')}
                  style={{ fontSize: 14 }}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: search */}
          <div className="max-w-[520px] w-full mx-auto hidden md:block">
            <div onClick={openSearch}
              className="flex items-center gap-2 border border-line bg-bg-soft rounded-[6px] text-ink-3 cursor-text hover:border-line-strong transition-colors"
              style={{ padding: '8px 12px', fontSize: 13 }}>
              <Search size={14} className="text-ink-2 flex-shrink-0" />
              <span className="flex-1 text-ink-3 truncate" style={{ fontSize: 13 }}>
                Search Lorestack — blogs, companies, people, tags…
              </span>
              <span className="hidden lg:flex gap-1 font-mono text-ink-3 flex-shrink-0" style={{ fontSize: 10 }}>
                <span className="border border-line-soft rounded-[3px] bg-bg" style={{ padding: '2px 5px' }}>⌘</span>
                <span className="border border-line-soft rounded-[3px] bg-bg" style={{ padding: '2px 5px' }}>K</span>
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={openSearch} className="md:hidden text-ink-2 hover:text-ink transition-colors p-1.5 rounded-[4px]" aria-label="Search">
              <Search size={16} />
            </button>

            {isAuthenticated ? (
              <>
                {/* Bell + badge */}
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setShowNotif((v) => !v)}
                    className={cn('flex text-ink-2 hover:text-ink transition-colors p-1.5 rounded-[4px]', showNotif && 'bg-bg-tint text-ink')}
                    aria-label="Open notifications"
                  >
                    <Bell size={16} />
                  </button>
                  {unreadCount > 0 && (
                    <span
                      className="absolute pointer-events-none bg-ls-accent text-white rounded-full font-mono leading-none flex items-center justify-center"
                      style={{ top: 2, right: 2, minWidth: 14, height: 14, fontSize: 9, padding: '0 3px' }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>

                <Link to={ROUTES.EDITOR_NEW}
                  className="hidden sm:flex items-center gap-1.5 bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
                  style={{ padding: '6px 12px', fontSize: 13 }}>
                  <PenLine size={14} /> Write
                </Link>

                {/* Avatar dropdown */}
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu((v) => !v)}
                    className={cn('rounded-full border transition-colors focus:outline-none',
                      showMenu ? 'border-ls-accent' : 'border-line hover:border-line-strong')}
                    style={{ width: 30, height: 30 }}
                    aria-label="Account menu"
                  >
                    <UserAvatar avatarUrl={authorProfile?.avatarUrl} name={authorProfile?.displayName} size={30} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-bg border border-line rounded-[6px] z-50"
                      style={{ minWidth: 188, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
                      {authorProfile && (
                        <div className="flex items-center border-b border-line-soft" style={{ gap: 10, padding: '10px 12px' }}>
                          <UserAvatar avatarUrl={authorProfile.avatarUrl} name={authorProfile.displayName} size={32} />
                          <div className="min-w-0">
                            <div className="font-semibold text-ink truncate" style={{ fontSize: 13 }}>{authorProfile.displayName}</div>
                            {authorProfile.username && (
                              <div className="text-ink-3 font-mono" style={{ fontSize: 11 }}>@{authorProfile.username}</div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="py-1">
                        {[
                          { to: ROUTES.HOME, Icon: Home, label: 'Home' },
                          { to: ROUTES.DASHBOARD, Icon: LayoutDashboard, label: 'Dashboard' },
                          { to: profileHref, Icon: User, label: 'Profile' },
                          { to: ROUTES.PROFILE_SETTINGS, Icon: Settings, label: 'Settings' },
                        ].map(({ to, Icon, label }) => (
                          <Link key={to} to={to}
                            className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors"
                            style={{ fontSize: 13 }}>
                            <Icon size={13} className="flex-shrink-0" /> {label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-line-soft py-1">
                        <button onClick={() => { setShowMenu(false); logout() }}
                          className="flex items-center gap-2.5 px-3 py-2 text-ink-2 hover:bg-bg-tint hover:text-ink transition-colors w-full text-left"
                          style={{ fontSize: 13 }}>
                          <LogOut size={13} className="flex-shrink-0" /> Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} state={{ from: location.pathname }}
                  className="hidden sm:block font-medium text-ink-2 hover:text-ink hover:bg-bg-tint rounded-[6px] transition-colors"
                  style={{ padding: '6px 12px', fontSize: 13 }}>
                  Log in
                </Link>
                <Link to={ROUTES.REGISTER} state={{ from: location.pathname }}
                  className="hidden sm:block bg-ls-accent text-white font-medium rounded-[6px] hover:bg-accent-ink transition-colors"
                  style={{ padding: '6px 12px', fontSize: 13 }}>
                  Sign up
                </Link>
              </>
            )}

            <button onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden text-ink-2 hover:text-ink transition-colors p-1.5 rounded-[4px]"
              aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
