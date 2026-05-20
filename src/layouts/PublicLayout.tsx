import { Outlet, Link, NavLink } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Explore',   to: ROUTES.EXPLORE },
  { label: 'Tags',      to: '/tags' },
  { label: 'Companies', to: '/companies' },
]

function TopNav() {
  const { isAuthenticated, authorProfile } = useAuthStore()
  const initials = authorProfile?.displayName
    ? authorProfile.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-line">
      <div
        className="grid items-center gap-6 px-6"
        style={{ gridTemplateColumns: 'auto 1fr auto', height: 56 }}
      >
        {/* Left: wordmark + nav tabs */}
        <div className="flex items-center gap-7">
          <Wordmark size={19} />
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

        {/* Center: search bar */}
        <div className="max-w-[520px] w-full mx-auto hidden md:block">
          <div
            className="flex items-center gap-2 border border-line bg-bg-soft rounded-[6px] text-ink-3 cursor-text hover:border-line-strong transition-colors"
            style={{ padding: '8px 12px', fontSize: 13 }}
          >
            <span className="font-mono text-ink-2" style={{ fontSize: 15 }}>⌕</span>
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
              <Link
                to={ROUTES.EDITOR_NEW}
                className="flex items-center gap-1.5 bg-ink text-bg font-medium rounded-[6px] hover:bg-black transition-colors"
                style={{ padding: '6px 12px', fontSize: 13 }}
              >
                <PenLine size={14} />
                Write
              </Link>
              <Link to={ROUTES.DASHBOARD}>
                <div
                  className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2 hover:border-line-strong transition-colors"
                  style={{ width: 30, height: 30, fontSize: 11 }}
                >
                  {initials}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-ink-2 hover:text-ink hover:bg-bg-tint rounded-[6px] transition-colors"
                style={{ padding: '6px 12px', fontSize: 13 }}
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
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
  )
}

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans">
      <TopNav />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-bg-deep">
        <div
          className="max-w-6xl mx-auto px-6 py-8 grid gap-6 text-ink-2"
          style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', fontSize: 13 }}
        >
          <div>
            <Wordmark size={17} asLink={false} />
            <p className="text-ink-3 leading-relaxed mt-2.5 max-w-[240px]" style={{ fontSize: 12 }}>
              A home for engineering stories. Made with care for the people who actually ship.
            </p>
            <div className="flex gap-2 mt-3.5 font-mono text-ink-3" style={{ fontSize: 11 }}>
              <span>↗ twitter</span>
              <span>↗ github</span>
              <span>↗ rss</span>
            </div>
          </div>

          {[
            ['Read', ['Explore', 'Companies', 'Tags', 'Authors', 'Featured']],
            ['Write', ['Start writing', 'Writer guide', 'Schedule blogs']],
            ['Platform', ['Pricing', 'Roadmap', 'Changelog', 'Status']],
            ['Company', ['About', 'Contact', 'Privacy', 'Terms']],
          ].map(([heading, items]) => (
            <div key={heading as string}>
              <div
                className="font-mono uppercase text-ink-3 mb-3"
                style={{ fontSize: 10, letterSpacing: '1.2px' }}
              >
                {heading as string}
              </div>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {(items as string[]).map((item) => (
                  <li key={item} className="text-ink-3 hover:text-ink-2 cursor-pointer" style={{ fontSize: 12 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
