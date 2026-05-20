export function NotificationsPage() {
  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <div style={{ marginBottom: 18 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>You</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>Notifications</h1>
      </div>

      <div className="rounded-[6px] border border-line flex flex-col items-center justify-center text-center" style={{ padding: 60 }}>
        <div style={{ fontSize: 40 }}>⌗</div>
        <h3 className="font-serif font-bold text-ink" style={{ fontSize: 18, marginTop: 16 }}>You're all caught up</h3>
        <p className="text-ink-2" style={{ margin: '6px 0 0', fontSize: 13 }}>
          Notifications will appear here when your blogs get reads, comments, or company invites.
        </p>
      </div>
    </div>
  )
}
