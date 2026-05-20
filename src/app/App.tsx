import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/QueryProvider'
import { AppRouter } from '@/routes/AppRouter'
import { useAuthStore } from '@/store/authStore'

function AuthInitialiser() {
  const initAuth = useAuthStore((s) => s.initAuth)
  useEffect(() => { initAuth() }, [initAuth])
  return null
}

export function App() {
  return (
    <QueryProvider>
      <AuthInitialiser />
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--ls-bg)',
            border: '1px solid var(--ls-line)',
            color: 'var(--ls-ink)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
          },
        }}
      />
    </QueryProvider>
  )
}
