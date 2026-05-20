import { Outlet } from 'react-router-dom'

// Auth pages (Register, Login, Forgot, Reset, EmailVerify) each manage their
// own full-page layout. This wrapper exists only as a React Router parent element
// to group routes that share GuestGuard — it renders children directly.
export function AuthLayout() {
  return <Outlet />
}
