import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, 'VITE_API_BASE_URL is required'),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
  VITE_APP_NAME: z.string().default('Lorestack'),
})

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
})

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`)
  throw new Error(`Missing or invalid environment variables:\n${issues.join('\n')}`)
}

export const env = parsed.data
