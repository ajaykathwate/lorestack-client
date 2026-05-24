import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { useUpdateProfile } from '@/api/hooks/useProfileMutations'
import { FormInput } from '@/shared/components/forms/FormInput'
import { SubmitButton } from '@/shared/components/forms/SubmitButton'
import { FormError } from '@/shared/components/forms/FormError'
import { updateProfileSchema, type UpdateProfileFormValues } from '@/lib/validations/profileSchemas'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { initials } from '@/lib/utils'
import type { ApiError } from '@/api/client/apiError'

export function ProfileSettingsPage() {
  const { authorProfile } = useAuthStore()
  const { mutate: updateProfile, isPending, error } = useUpdateProfile()
  const apiError = error as ApiError | null
  const avatarFileRef = useRef<HTMLInputElement>(null)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)

  const { control, handleSubmit, watch, setValue } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: authorProfile?.displayName ?? '',
      bio: authorProfile?.bio ?? '',
      avatarUrl: authorProfile?.avatarUrl ?? '',
      websiteUrl: authorProfile?.websiteUrl ?? '',
      twitterHandle: authorProfile?.twitterHandle ?? '',
      githubHandle: authorProfile?.githubHandle ?? '',
      linkedinUrl: authorProfile?.linkedinUrl ?? '',
    },
  })

  const displayName = watch('displayName') ?? ''
  const avatarUrl = watch('avatarUrl') ?? ''
  const avatarInitials = displayName ? initials(displayName) : initials(authorProfile?.displayName ?? '?')

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsAvatarUploading(true)
    try {
      const url = await uploadToCloudinary(file, 'authors')
      setValue('avatarUrl', url, { shouldDirty: true })
    } catch {
      toast.error('Avatar upload failed. Please try again.')
    } finally {
      setIsAvatarUploading(false)
      if (avatarFileRef.current) avatarFileRef.current.value = ''
    }
  }

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfile(values, {
      onSuccess: () => toast.success('Profile updated.'),
      onError: () => toast.error('Failed to update profile.'),
    })
  }

  return (
    <div className="flex flex-col" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: '1.2px' }}>Settings</span>
        <h1 className="font-serif font-bold text-ink" style={{ fontSize: 26, marginTop: 4 }}>Profile settings</h1>
        <p className="text-ink-2" style={{ fontSize: 14, marginTop: 4 }}>
          Your public profile on Lorestack.
        </p>
      </div>

      {/* Avatar preview */}
      <div className="flex items-center" style={{ gap: 16, marginBottom: 24, padding: '16px 0', borderBottom: '1px solid var(--ls-line-soft)' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover"
            style={{ width: 64, height: 64 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div
            className="rounded-full bg-bg-tint border border-line flex items-center justify-center font-mono text-ink-2"
            style={{ width: 64, height: 64, fontSize: 22 }}
          >
            {avatarInitials}
          </div>
        )}
        <div className="flex flex-col" style={{ gap: 6 }}>
          <div className="font-semibold text-ink" style={{ fontSize: 15 }}>{displayName || authorProfile?.displayName || 'Your name'}</div>
          <div className="text-ink-3 font-mono" style={{ fontSize: 12 }}>@{authorProfile?.username ?? 'username'}</div>
          <button
            type="button"
            onClick={() => avatarFileRef.current?.click()}
            disabled={isAvatarUploading}
            className="self-start border border-line text-ink-2 rounded-[4px] hover:bg-bg-tint transition-colors disabled:opacity-50"
            style={{ padding: '4px 10px', fontSize: 12 }}
          >
            {isAvatarUploading ? 'Uploading…' : 'Change photo'}
          </button>
          <input ref={avatarFileRef} type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: 'none' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 14 }}>
        {apiError && <FormError message={apiError.message} />}

        <FormInput control={control} name="displayName" label="Display name" placeholder="Ajay Kathwate" />

        <div className="flex flex-col" style={{ gap: 6 }}>
          <label className="text-ink-2" style={{ fontSize: 13, fontWeight: 500 }}>Bio</label>
          <textarea
            {...(control.register as (name: string) => object)('bio')}
            rows={3}
            placeholder="Distributed systems engineer. Writing about postgres, latency, and the boring stuff that ships products."
            className="w-full rounded-[6px] border border-line bg-bg text-ink placeholder:text-ink-3 resize-none transition-colors focus:outline-none focus:border-line-strong"
            style={{ padding: '10px 12px', fontSize: 14 }}
          />
          <p className="text-ink-3" style={{ fontSize: 12 }}>Max 300 characters</p>
        </div>

        <div className="border-t border-line" style={{ paddingTop: 14, marginTop: 4 }}>
          <div className="font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: '1.2px', marginBottom: 12 }}>
            Social links
          </div>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <FormInput control={control} name="websiteUrl" label="Website" placeholder="https://yoursite.dev" />
            <FormInput control={control} name="twitterHandle" label="Twitter / X handle" placeholder="zarakhan (no @)" />
            <FormInput control={control} name="githubHandle" label="GitHub handle" placeholder="zarakhan" />
            <FormInput control={control} name="linkedinUrl" label="LinkedIn URL" placeholder="https://linkedin.com/in/zarakhan" />
          </div>
        </div>

        <SubmitButton isLoading={isPending} loadingText="Saving…" className="w-auto self-start px-8 mt-2">
          Save changes
        </SubmitButton>
      </form>
    </div>
  )
}
