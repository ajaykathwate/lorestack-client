import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Wordmark } from '@/shared/components/ui/Wordmark'
import { FormInput } from '@/shared/components/forms/FormInput'
import { SubmitButton } from '@/shared/components/forms/SubmitButton'
import { useForgotPassword } from '@/api/hooks/useAuthMutations'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/authSchemas'
import { ROUTES } from '@/constants/routes'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { mutate, isPending } = useForgotPassword()

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(values: ForgotPasswordFormValues) {
    mutate(values, { onSuccess: () => setSent(true) })
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex items-center justify-center" style={{ padding: 48 }}>
      <div className="w-full flex flex-col" style={{ maxWidth: 400, gap: 0 }}>
        <Wordmark size={20} />

        {sent ? (
          <div className="flex flex-col" style={{ gap: 12, marginTop: 32 }}>
            <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.4px' }}>
              Check your inbox
            </span>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 26, margin: 0 }}>
              Reset link sent
            </h2>
            <p className="text-ink-3 leading-relaxed" style={{ fontSize: 14, margin: 0 }}>
              If that email is in our system, you'll receive a reset link shortly. The link is
              valid for 1 hour.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="text-ls-accent underline underline-offset-2 hover:text-accent-ink text-center"
              style={{ fontSize: 13, marginTop: 8 }}
            >
              ← Back to log in
            </Link>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: 14, marginTop: 32 }}>
            <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.4px' }}>
              Step 1 of 3
            </span>
            <h2 className="font-serif font-bold text-ink" style={{ fontSize: 26, margin: 0 }}>
              Reset your password
            </h2>
            <p className="text-ink-3" style={{ fontSize: 14, margin: 0 }}>
              Enter the email tied to your account. We'll send a reset link valid for 1 hour.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 12, marginTop: 4 }}>
              <FormInput
                control={control}
                name="email"
                label="Email address"
                type="email"
                placeholder="you@studio.dev"
              />
              <SubmitButton isLoading={isPending} loadingText="Sending…">
                Send reset link
              </SubmitButton>
            </form>

            <Link
              to={ROUTES.LOGIN}
              className="text-ls-accent underline underline-offset-2 hover:text-accent-ink text-center"
              style={{ fontSize: 13 }}
            >
              ← Back to log in
            </Link>

            <div
              className="rounded-[6px] border border-line bg-bg-soft"
              style={{ padding: '14px 16px', marginTop: 10 }}
            >
              <p
                className="font-mono uppercase text-ink-3"
                style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 8 }}
              >
                What happens next
              </p>
              <p className="text-ink-2 leading-relaxed" style={{ fontSize: 13 }}>
                1. Check your inbox (link valid 1 hour)
                <br />
                2. Tap the link → new password screen
                <br />
                3. All existing sessions invalidated on save
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
