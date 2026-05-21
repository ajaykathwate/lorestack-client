interface Props {
  title: string
  description?: string
}

export function SettingsPlaceholderPage({ title, description }: Props) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Settings</span>
      <h1 className="font-serif font-semibold text-ink" style={{ fontSize: 24, marginTop: 4 }}>{title}</h1>
      {description && (
        <p className="text-ink-2" style={{ margin: '4px 0 22px', fontSize: 13 }}>{description}</p>
      )}
      <div className="border border-line rounded-[6px] bg-bg-soft flex items-center justify-center" style={{ padding: 40 }}>
        <p className="text-ink-3" style={{ fontSize: 13 }}>Coming soon.</p>
      </div>
    </div>
  )
}
