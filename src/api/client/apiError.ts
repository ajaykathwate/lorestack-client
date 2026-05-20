import type { AxiosError } from 'axios'

export interface ApiError {
  status: number
  message: string
  // Field-level validation errors from the backend (e.g. { email: ['Already taken'] })
  errors?: Record<string, string[]>
  code?: string
}

export function normalizeApiError(error: AxiosError): ApiError {
  const response = error.response

  if (!response) {
    return {
      status: 0,
      message: 'Network error. Please check your connection.',
    }
  }

  const data = response.data as Record<string, unknown> | undefined

  const message =
    (data?.message as string) ||
    (data?.error as string) ||
    getDefaultMessage(response.status)

  const errors = data?.errors as Record<string, string[]> | undefined
  const code = data?.code as string | undefined

  return { status: response.status, message, errors, code }
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Invalid request. Please check your input.'
    case 401: return 'Authentication required. Please log in.'
    case 403: return 'You do not have permission to perform this action.'
    case 404: return 'The requested resource was not found.'
    case 409: return 'A conflict occurred. Please try again.'
    case 429: return 'Too many requests. Please slow down.'
    case 500: return 'Server error. Please try again later.'
    default:  return 'An unexpected error occurred.'
  }
}
