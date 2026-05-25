import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional custom fallback. Receives the error and a reset function. */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (error) {
      if (this.props.fallback) return this.props.fallback(error, this.reset)
      return <DefaultErrorFallback error={error} reset={this.reset} />
    }
    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-4"
      style={{ minHeight: 320, gap: 16 }}
    >
      <div className="font-mono text-ink-3" style={{ fontSize: 28 }}>⚠</div>
      <div>
        <p className="font-semibold text-ink" style={{ fontSize: 15 }}>Something went wrong</p>
        <p className="text-ink-3" style={{ fontSize: 13, marginTop: 4, maxWidth: 360 }}>
          {error.message || 'An unexpected error occurred. Try refreshing the page.'}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="border border-line text-ink-2 hover:bg-bg-tint rounded-[6px] transition-colors font-medium"
          style={{ padding: '8px 18px', fontSize: 13 }}
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-ink text-bg hover:bg-black rounded-[6px] transition-colors font-medium"
          style={{ padding: '8px 18px', fontSize: 13 }}
        >
          Reload page
        </button>
      </div>
    </div>
  )
}
