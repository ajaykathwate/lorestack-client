import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/shared/components/feedback/Spinner'
import { ROUTES } from '@/constants/routes'
import { env } from '@/config/env'
import type { User, AuthorProfile } from '@/types/api/auth'

// Google redirects the browser here after OAuth with ?code=... in the query params.
// We forward those params to the backend callback endpoint via XHR to get tokens (JSON),
// then fetch the user with an explicit Authorization header and complete the auth flow.
export function GoogleCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth, setAuthorProfile } = useAuthStore()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const code = params.get('code')
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')

    if (!code && (!accessToken || !refreshToken)) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }

    ;(async () => {
      try {
        let at: string
        let rt: string

        if (code) {
          // Code flow: browser landed here from Google — forward all params to backend via XHR
          const callbackRes = await axios.get(
            `${env.VITE_API_BASE_URL}/auth/google/callback`,
            { params: Object.fromEntries(params.entries()) },
          )
          at = callbackRes.data.data.accessToken
          rt = callbackRes.data.data.refreshToken
        } else {
          // Token flow: backend already exchanged and redirected with tokens in query params
          at = accessToken!
          rt = refreshToken!
        }

        const authHeader = { Authorization: `Bearer ${at}` }

        const userRes = await axios.get<{ data: User }>(
          `${env.VITE_API_BASE_URL}/users/me`,
          { headers: authHeader },
        )
        const user = userRes.data.data
        setAuth(at, rt, user, null)

        try {
          const profileRes = await axios.get<{ data: AuthorProfile }>(
            `${env.VITE_API_BASE_URL}/author-profiles/me`,
            { headers: authHeader },
          )
          setAuthorProfile(profileRes.data.data)
          navigate(ROUTES.DASHBOARD, { replace: true })
        } catch {
          setAuthorProfile(null)
          navigate(ROUTES.ONBOARDING, { replace: true })
        }
      } catch {
        navigate(ROUTES.LOGIN, { replace: true })
      }
    })()
  }, [params, navigate, setAuth, setAuthorProfile])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-[13px] text-ink-3 font-sans">Signing you in…</p>
      </div>
    </div>
  )
}
