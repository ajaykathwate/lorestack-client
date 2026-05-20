export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-line border-t-ls-accent rounded-full animate-spin" />
        <span className="text-xs text-ink-3 font-mono tracking-wide uppercase">
          Loading
        </span>
      </div>
    </div>
  )
}
