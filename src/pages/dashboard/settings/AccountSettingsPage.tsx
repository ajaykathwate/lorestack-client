import { useAuthStore } from '@/store/authStore'

export function AccountSettingsPage() {
  const { user } = useAuthStore()

  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Settings</span>
      <h1 className="font-serif font-semibold text-ink" style={{ fontSize: 24, marginTop: 4 }}>Account</h1>
      <p className="text-ink-2" style={{ margin: '4px 0 22px', fontSize: 13 }}>
        Login credentials, two-factor auth, and active sessions.
      </p>

      <div className="border border-line rounded-[6px]" style={{ padding: 18, marginBottom: 14 }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink" style={{ fontSize: 15 }}>Email address</h3>
            <div className="font-mono text-ink-2" style={{ fontSize: 13, marginTop: 4 }}>
              {user?.email ?? '—'}
            </div>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>
              Verified · changing this triggers re-verification
            </div>
          </div>
          <button
            disabled
            className="border border-line bg-bg text-ink-2 rounded-[4px] cursor-not-allowed opacity-50"
            style={{ padding: '5px 10px', fontSize: 12 }}
          >
            Change email
          </button>
        </div>
      </div>

      <div className="border border-line rounded-[6px]" style={{ padding: 18, marginBottom: 14 }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink" style={{ fontSize: 15 }}>Password</h3>
            <div className="text-ink-3" style={{ fontSize: 11, marginTop: 4 }}>
              Change your account password
            </div>
          </div>
          <button
            disabled
            className="border border-line bg-bg text-ink-2 rounded-[4px] cursor-not-allowed opacity-50"
            style={{ padding: '5px 10px', fontSize: 12 }}
          >
            Change password
          </button>
        </div>
      </div>

      <div className="border border-line rounded-[6px] bg-bg-soft" style={{ padding: '10px 14px' }}>
        <span className="text-ink-3" style={{ fontSize: 12 }}>
          More account settings coming soon.
        </span>
      </div>
    </div>
  )
}
