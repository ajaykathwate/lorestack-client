import { Outlet } from 'react-router-dom'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { TopNav } from '@/shared/components/TopNav'

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
