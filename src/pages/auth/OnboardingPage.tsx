import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { FormInput } from '@/shared/components/forms/FormInput'
import { SubmitButton } from '@/shared/components/forms/SubmitButton'
import { FormError } from '@/shared/components/forms/FormError'
import { useOnboarding } from '@/api/hooks/useAuthMutations'
import { useUpdateProfile } from '@/api/hooks/useProfileMutations'
import { useAuthStore } from '@/store/authStore'
import { onboardingSchema, type OnboardingFormValues } from '@/lib/validations/authSchemas'
import { ROUTES } from '@/constants/routes'
import type { ApiError } from '@/api/client/apiError'

interface ExtendedOnboardingValues extends OnboardingFormValues {
  bio?: string
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { authorProfile } = useAuthStore()
  const { mutate: onboard, isPending: onboardPending, error } = useOnboarding()
  const { mutate: updateProfile, isPending: updatePending } = useUpdateProfile()

  const isPending = onboardPending || updatePending
  const apiError = error as ApiError | null

  const { control, handleSubmit, watch } = useForm<ExtendedOnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { displayName: '', avatarUrl: '', bio: '' },
  })

  const displayName = watch('displayName')
  const avatarUrl = watch('avatarUrl')

  const initials = displayName
    ? displayName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  function onSubmit(values: ExtendedOnboardingValues) {
    onboard(
      { displayName: values.displayName, avatarUrl: values.avatarUrl || undefined },
      {
        onSuccess: (profile) => {
          if (values.bio?.trim()) {
            updateProfile(
              { bio: values.bio },
              {
                onSettled: () => {
                  toast.success(`Welcome to Lorestack, ${profile.displayName}!`)
                  navigate(ROUTES.DASHBOARD)
                },
              },
            )
          } else {
            toast.success(`Welcome to Lorestack, ${profile.displayName}!`)
            navigate(ROUTES.DASHBOARD)
          }
        },
      },
    )
  }

  if (authorProfile) {
    navigate(ROUTES.DASHBOARD, { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col" style={{ padding: '40px 80px' }}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Wordmark size={20} />
        <div className="flex items-center gap-1 text-ink-3" style={{ fontSize: 13 }}>
          Step 1 of 1 ·{' '}
          <Link
            to={ROUTES.DASHBOARD}
            className="underline underline-offset-2 hover:text-ink-2"
          >
            Skip for now
          </Link>
        </div>
      </div>

      {/* Centered form area */}
      <div
        className="flex-1 flex flex-col justify-center w-full mx-auto"
        style={{ maxWidth: 520, gap: 18 }}
      >
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.4px' }}>
          Welcome to Lorestack
        </span>
        <h2 className="font-serif font-bold text-ink" style={{ fontSize: 28, margin: 0 }}>
          How should we introduce you?
        </h2>
        <p className="text-ink-3" style={{ fontSize: 14, margin: '-4px 0 4px' }}>
          You can change anything later in Settings.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 16 }}>
          {apiError && <FormError message={apiError.message} />}

          <div className="flex" style={{ gap: 20, alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ gap: 8 }}>
              <div
                className="rounded-full bg-bg-tint border border-line flex items-center justify-center overflow-hidden"
                style={{ width: 86, height: 86 }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <span className="font-mono text-ink-3" style={{ fontSize: 22 }}>{initials}</span>
                )}
              </div>
              <span className="text-ink-3" style={{ fontSize: 11 }}>or skip</span>
            </div>

            {/* Fields */}
            <div className="flex-1 flex flex-col" style={{ gap: 12 }}>
              <FormInput
                control={control}
                name="displayName"
                label="Display name"
                placeholder="Ajay Kathwate"
              />
              <FormInput
                control={control}
                name="avatarUrl"
                label="Avatar URL (optional)"
                placeholder="https://example.com/avatar.png"
              />
              <div className="flex flex-col" style={{ gap: 6 }}>
                <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 500 }}>
                  Short bio (optional)
                </label>
                <textarea
                  {...(control.register as (name: string) => object)('bio')}
                  rows={2}
                  placeholder="Distributed systems @ Aurora · ex-Stripe · postgres apologist"
                  className="w-full rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 resize-none transition-colors focus:outline-none focus:ring-1 focus:ring-ls-accent focus:border-ls-accent"
                  style={{ padding: '10px 12px', fontSize: 14 }}
                />
                <p className="text-ink-3" style={{ fontSize: 12 }}>Max 300 characters · you can add this later</p>
              </div>
            </div>
          </div>

          <SubmitButton
            isLoading={isPending}
            loadingText="Setting up your profile…"
            className="w-auto self-start px-8"
          >
            Go to Lorestack →
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}
