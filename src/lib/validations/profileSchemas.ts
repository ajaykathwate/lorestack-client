import { z } from 'zod'

export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Username may only contain lowercase letters, numbers, and hyphens')
    .optional(),
  bio: z.string().max(300, 'Bio must be 300 characters or less').optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  expertiseTags: z.array(z.string()).optional(),
  twitterHandle: z.string().optional(),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubHandle: z.string().optional(),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
