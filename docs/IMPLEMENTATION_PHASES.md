# Lorestack Frontend — Implementation Phases

Each phase is a self-contained unit of work. A phase must be fully complete and functional before the next begins. No assumptions are made. No phase leaves anything partially implemented.

---

## BEFORE STARTING ANY PHASE

Read and internalize all three documents:
- `/docs/claude_design/index.html` and all files in `/docs/claude_design/` — DESIGN SOURCE OF TRUTH
- `/docs/PRODUCT_README.md` — product flows, RBAC, MVP scope
- `/docs/TESTING.md` — all backend endpoints, payloads, auth contracts

Do not proceed without reading all three. Do not invent anything not specified in these documents.

---

## PHASE 1 — Project Foundation & Infrastructure

**Scope:** Everything needed for the project to boot, render a blank shell, and have all infrastructure wired up. No real pages. No business logic. No auth flows. Just the skeleton that everything else will be built on.

### 1.1 — Dependency Installation

Install the following packages exactly (no extras unless explicitly stated here):

**Core:**
- react, react-dom
- typescript
- vite + @vitejs/plugin-react

**Styling:**
- tailwindcss, postcss, autoprefixer
- tailwindcss-animate (used by shadcn/ui)

**UI Primitives:**
- shadcn/ui (initialized via CLI after Tailwind is configured)
- lucide-react

**Routing:**
- react-router-dom (latest v6+)

**State:**
- zustand

**Data Fetching:**
- @tanstack/react-query
- @tanstack/react-query-devtools

**HTTP:**
- axios

**Forms:**
- react-hook-form
- @hookform/resolvers
- zod

**Notifications:**
- sonner

**Editor:**
- react-quill (Quill-based rich text editor — this is the only editor to use)
- quill (peer dependency)

Do not install anything else in this phase.

### 1.2 — Folder Structure

Create the following folder structure under `src/`. Create each folder with a `.gitkeep` or an `index.ts` barrel file so they are tracked. Do not populate them with logic yet — only the scaffolding.

```
src/
  app/
  routes/
  layouts/
  pages/
    public/
    auth/
    dashboard/
  features/
    auth/
    blog/
    editor/
    company/
    team/
    profile/
    notifications/
  shared/
    components/
      ui/
      forms/
      layout/
      feedback/
    hooks/
    utils/
    constants/
    types/
  api/
    client/
    services/
    hooks/
    keys/
  store/
  lib/
  config/
  providers/
  types/
  constants/
```

### 1.3 — Tailwind Theme Configuration

Read `/docs/claude_design/index.html` and all files in `/docs/claude_design/`.

Extract the following values exactly as they appear in the design files:
- All color values (background, text, border, primary, secondary, accent, muted, destructive, etc.)
- Border radius values
- Font families
- Font size scale
- Shadow values
- Transition/animation values
- Spacing overrides if any

Configure `tailwind.config.ts` with:
- `content` pointing to all `src/**/*.{ts,tsx}` files
- `theme.extend` containing all extracted design tokens
- CSS variables wired through `globals.css` for use with shadcn/ui
- Dark mode set to `class`

Configure `src/index.css` (or `globals.css`) with:
- All CSS variable definitions for the extracted color tokens
- Base layer resets matching the design file

Do not use any default Tailwind colors for brand/product colors. All colors must come from the design files.

### 1.4 — shadcn/ui Initialization

Run `npx shadcn@latest init` after Tailwind is configured.

Configure it to use:
- The CSS variable system set up in 1.3
- TypeScript
- `src/shared/components/ui/` as the component destination

Add only the following shadcn/ui components in this phase (these are needed by infrastructure):
- button
- input
- label
- form
- dropdown-menu
- avatar
- badge
- separator
- skeleton
- toast (or use sonner directly — do not duplicate)
- dialog
- sheet
- tooltip

### 1.5 — TypeScript Configuration

Configure `tsconfig.json` with:
- `"strict": true`
- Path aliases: `@/*` → `src/*`
- All strict checks enabled

Configure `vite.config.ts` with the same `@/*` path alias.

### 1.6 — Environment Variables

Create `.env.example` at the project root with the following variables (empty values, just the keys):

```
VITE_API_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_APP_NAME=
```

Create `.env.local` (gitignored) with the same keys for local development. Do not hardcode any values in source code.

Create `src/config/env.ts` that exports typed, validated environment variables using Zod. This file is the only place in the codebase that reads `import.meta.env`. Throw a clear error at startup if required variables are missing.

### 1.7 — Constants

Create `src/constants/routes.ts` — export a `ROUTES` object with all route path strings. Do not hardcode path strings anywhere else in the codebase. Derive all route paths from this object.

Route keys to define (paths derived from PRODUCT_README.md):
- Public: HOME, EXPLORE, BLOG (with slug param), TAG (with slug param), AUTHOR_PROFILE (with username param), COMPANY_PROFILE (with slug param)
- Auth: LOGIN, REGISTER, FORGOT_PASSWORD, RESET_PASSWORD, EMAIL_VERIFY, ONBOARDING
- Dashboard: DASHBOARD, MY_BLOGS, DRAFTS, SCHEDULED, EDITOR (with optional id param), COMPANY_DASHBOARD, COMPANY_SETTINGS, TEAM_MANAGEMENT, PROFILE_SETTINGS, NOTIFICATIONS

Create `src/constants/queryKeys.ts` — export a `QUERY_KEYS` object with all TanStack Query key arrays. No query key strings should appear outside this file.

### 1.8 — Axios Client

Create `src/api/client/axiosInstance.ts`:
- Base URL from `env.ts`
- Default headers: `Content-Type: application/json`
- Request interceptor: attach `Authorization: Bearer <token>` from Zustand auth store if token exists
- Response interceptor:
  - On 401: attempt silent token refresh using the refresh endpoint from TESTING.md, retry the original request once, then on second 401 clear auth state and redirect to login
  - On all other errors: normalize the error into a typed `ApiError` shape and reject
- Export a typed `apiClient` instance

Create `src/api/client/apiError.ts`:
- Define `ApiError` type with `status`, `message`, `errors` (field-level validation errors), `code`
- Export a `normalizeApiError` function that converts Axios errors into `ApiError`

### 1.9 — Zustand Stores (Structure Only)

Create the following store files. Each must export a properly typed Zustand store. In this phase, only define the shape and initial state. Actions will be implemented in Phase 2.

`src/store/authStore.ts`:
- State: `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `isLoading`
- Shape the `user` type from the user object described in TESTING.md
- Actions (stub only, no implementation): `setAuth`, `clearAuth`, `setUser`

`src/store/uiStore.ts`:
- State: `sidebarOpen` (boolean)
- Actions: `toggleSidebar`, `setSidebarOpen`

### 1.10 — TanStack Query Provider

Create `src/providers/QueryProvider.tsx`:
- Wrap children with `QueryClientProvider`
- Configure `QueryClient` with sensible defaults:
  - `staleTime`: 1 minute
  - `retry`: 1
  - `refetchOnWindowFocus`: false
- Include `ReactQueryDevtools` in development only

### 1.11 — React Router Setup (Shell Only)

Create `src/routes/AppRouter.tsx`:
- Use `createBrowserRouter` + `RouterProvider`
- Define route tree using path strings from `ROUTES` constants
- All route components can render `<div>placeholder</div>` at this stage
- Define the following route groups:
  - Public routes (no auth required)
  - Auth routes (redirect to dashboard if already authenticated)
  - Protected routes (redirect to login if not authenticated)
  - Role-protected routes (redirect with appropriate behavior if role does not match)

Create `src/routes/guards/`:
- `AuthGuard.tsx` — redirects unauthenticated users to login
- `GuestGuard.tsx` — redirects authenticated users away from auth pages
- `RoleGuard.tsx` — accepts a `roles` prop, checks current user's role, redirects if not authorized. Roles must match the role strings defined in TESTING.md exactly.

### 1.12 — Layouts (Shell Only)

Create the following layout files. They render a structural shell only — no real content, no navigation links, just the DOM structure with correct Tailwind class names matching the design files.

`src/layouts/PublicLayout.tsx` — wrapper for public pages (navbar + content + footer)
`src/layouts/AuthLayout.tsx` — wrapper for auth pages (centered card layout)
`src/layouts/DashboardLayout.tsx` — wrapper for authenticated pages (sidebar + topbar + content area)

Each layout must use the class names and structural patterns from the design files. Do not invent layout structure.

### 1.13 — App Entry Point

Wire everything together in `src/app/App.tsx`:
- Wrap with `QueryProvider`
- Wrap with `<Toaster />` from sonner
- Render `<AppRouter />`

`src/main.tsx` renders `<App />` into the DOM root.

### Phase 1 Exit Criteria

The following must be true before Phase 1 is considered complete:
- `npm run dev` starts without errors
- The app renders without crashing
- All folder structure exists
- Tailwind theme is configured with design-file colors
- shadcn/ui components are available
- Axios instance exists with interceptor stubs
- Zustand stores exist with correct types
- React Router is initialized with all route paths defined (rendering placeholders)
- All guards exist (even if logic is incomplete)
- Environment variable system works
- No TypeScript errors (`npm run build` passes)

---

## PHASE 2 — Authentication, API Layer & Shared Components

**Scope:** Complete auth system end-to-end, fully wired API service layer, all shared/reusable UI components, and form infrastructure. After this phase, a user can register, verify email, log in, complete onboarding, and be redirected to the dashboard shell. All shared components used across the entire app are built here.

### 2.1 — Auth Store (Full Implementation)

Implement all actions in `src/store/authStore.ts` (stubbed in Phase 1):

`setAuth(accessToken, refreshToken, user)`:
- Store tokens in `localStorage` (keys: `lorestack_access_token`, `lorestack_refresh_token`)
- Update store state

`clearAuth()`:
- Remove tokens from `localStorage`
- Reset store to initial unauthenticated state

`setUser(user)`:
- Update only the user object in state

Add an `initAuth()` action:
- Called once on app startup
- Reads tokens from localStorage
- If tokens exist, calls the `/auth/me` endpoint (from TESTING.md) to validate and hydrate the user
- On failure, calls `clearAuth()`

Call `initAuth()` in `src/app/App.tsx` on mount (before rendering routes).

### 2.2 — API Services (All Endpoints)

For every endpoint documented in TESTING.md, create a typed service function.

Organize into:

`src/api/services/authService.ts`:
- `register(payload)` — POST /auth/register
- `verifyEmail(payload)` — POST /auth/verify-email
- `resendVerification(payload)` — POST /auth/resend-verification
- `login(payload)` — POST /auth/login
- `googleCallback(payload)` — POST or GET as documented in TESTING.md
- `forgotPassword(payload)` — POST /auth/forgot-password
- `resetPassword(payload)` — POST /auth/reset-password
- `refreshToken(payload)` — POST /auth/refresh
- `logout()` — POST /auth/logout
- `me()` — GET /auth/me
- `completeOnboarding(payload)` — POST or PATCH as documented in TESTING.md

`src/api/services/blogService.ts`:
- All blog CRUD endpoints from TESTING.md
- Publish, draft, schedule endpoints
- Public blog listing/fetching endpoints
- Author-specific endpoints

`src/api/services/companyService.ts`:
- All company management endpoints from TESTING.md
- Team member endpoints
- Invite endpoints
- Role assignment endpoints

`src/api/services/tagService.ts`:
- All tag endpoints from TESTING.md

`src/api/services/profileService.ts`:
- All user profile endpoints from TESTING.md

Each service function must:
- Accept a typed payload matching TESTING.md exactly
- Return a typed response matching TESTING.md exactly
- Use `apiClient` from Phase 1
- Not handle errors (errors flow to TanStack Query or calling code)

All request and response types go in `src/types/api/` — one file per domain (auth.ts, blog.ts, company.ts, etc.).

### 2.3 — TanStack Query Hooks (All Domains)

Create query and mutation hooks for all service functions.

Organize into:

`src/api/hooks/useAuthMutations.ts` — mutations for register, login, logout, verify, forgot password, reset password, onboarding
`src/api/hooks/useAuthQueries.ts` — query for current user (me)
`src/api/hooks/useBlogQueries.ts` — queries for blog listing, single blog, author blogs, drafts, scheduled
`src/api/hooks/useBlogMutations.ts` — mutations for create, update, delete, publish, schedule
`src/api/hooks/useCompanyQueries.ts` — company info, team members
`src/api/hooks/useCompanyMutations.ts` — create company, update, invite member, remove member, change role
`src/api/hooks/useTagQueries.ts` — list tags, tag detail
`src/api/hooks/useProfileMutations.ts` — update profile

Each hook must:
- Use query keys from `QUERY_KEYS` constants
- Invalidate correct queries in mutation `onSuccess` callbacks
- Expose `isLoading`, `isError`, `error` (typed as `ApiError`)
- Support pagination where the endpoint supports it (using `useInfiniteQuery`)

### 2.4 — Zod Schemas (All Forms)

Create `src/lib/validations/` with one file per domain:
- `authSchemas.ts` — register, login, forgot password, reset password, onboarding schemas
- `blogSchemas.ts` — create/edit blog, schedule blog schemas
- `companySchemas.ts` — create company, invite member schemas
- `profileSchemas.ts` — update profile schema

All field-level constraints must match exactly what TESTING.md documents. Do not invent validation rules.

Export both the schema (for React Hook Form) and the inferred TypeScript type from each schema.

### 2.5 — Shared Form Components

Create reusable form primitives in `src/shared/components/forms/`:

`FormInput.tsx` — wraps shadcn Input + FormField + FormMessage. Props: name, label, placeholder, type, disabled.
`FormTextarea.tsx` — same pattern for textarea.
`FormSelect.tsx` — wraps shadcn Select + FormField + FormMessage.
`FormCheckbox.tsx` — wraps shadcn Checkbox + FormField.
`SubmitButton.tsx` — button that shows spinner when loading, disabled when submitting.
`FormError.tsx` — displays server-level error (non-field error).

All form components must:
- Work with React Hook Form `control` prop
- Display inline validation errors
- Show correct disabled/loading states
- Match the design file styling

### 2.6 — Shared Feedback Components

Create in `src/shared/components/feedback/`:

`Spinner.tsx` — loading spinner, sizes: sm / md / lg
`Skeleton.tsx` — re-export or wrap shadcn Skeleton with preset sizes (line, card, avatar, list)
`EmptyState.tsx` — props: icon, title, description, optional action button
`ErrorState.tsx` — props: title, message, optional retry callback
`PageLoader.tsx` — full page centered spinner for route-level loading

All must use design-file colors and spacing.

### 2.7 — Shared Layout Components

Implement the actual layouts from Phase 1 shell:

`src/layouts/PublicLayout.tsx`:
- Navbar: logo, navigation links (Explore, Blog), login/register buttons or user avatar dropdown if authenticated. Match design files exactly.
- Footer: as shown in design files.
- Content area fills remaining height.

`src/layouts/AuthLayout.tsx`:
- Centered card on background. Match design files exactly.
- Includes logo above card.

`src/layouts/DashboardLayout.tsx`:
- Sidebar with navigation items (from PRODUCT_README.md, matching design files)
- Sidebar collapses on mobile (use `uiStore` from Phase 1)
- Topbar with page title area and user menu
- Content area with correct padding

Navigation items in sidebar must be role-aware: show only items the current user's role is permitted to access. Role definitions come from PRODUCT_README.md.

### 2.8 — Auth Pages (Full Implementation)

Implement every auth page using the shared form components from 2.5, layout from 2.7, Zod schemas from 2.4, and mutations from 2.3.

`src/pages/auth/RegisterPage.tsx`:
- Fields: as documented in TESTING.md register endpoint
- On success: show message to check email for verification

`src/pages/auth/EmailVerifyPage.tsx`:
- Reads token from URL query param (as documented in TESTING.md)
- Calls verify endpoint on mount
- Shows success or error state
- Resend verification option

`src/pages/auth/LoginPage.tsx`:
- Fields: email, password
- On success: call `setAuth`, redirect to dashboard or onboarding depending on user state
- Google OAuth button: redirect to Google OAuth URL (exact flow from TESTING.md)

`src/pages/auth/GoogleCallbackPage.tsx`:
- Reads code/token from URL (as documented in TESTING.md)
- Calls google callback endpoint
- On success: call `setAuth`, redirect appropriately

`src/pages/auth/ForgotPasswordPage.tsx`:
- Email field, submit, success message

`src/pages/auth/ResetPasswordPage.tsx`:
- Reads token from URL query param
- New password + confirm password fields
- On success: redirect to login

`src/pages/auth/OnboardingPage.tsx`:
- Multi-step or single form — follow PRODUCT_README.md onboarding flow exactly
- Fields must match TESTING.md onboarding endpoint exactly
- On success: redirect to dashboard

Wire all auth pages into the router using `GuestGuard` (redirect if already authenticated), except `OnboardingPage` which uses `AuthGuard`.

Update `AuthGuard` to also check if the user has completed onboarding (based on user object from TESTING.md). If authenticated but onboarding incomplete, redirect to onboarding page.

### 2.9 — Route Guards (Full Implementation)

Implement full logic in the guards created in Phase 1:

`AuthGuard.tsx`:
- Show `PageLoader` while `initAuth` is in progress
- Redirect to `/login` if not authenticated
- Redirect to `/onboarding` if authenticated but onboarding not complete (check user field from TESTING.md)

`GuestGuard.tsx`:
- Show `PageLoader` while `initAuth` is in progress
- Redirect to dashboard if already authenticated

`RoleGuard.tsx`:
- Accept `allowedRoles: string[]` prop
- Check `authStore` user role against allowed roles
- If not authorized, redirect to dashboard (not logout)

### Phase 2 Exit Criteria

The following must be true before Phase 2 is considered complete:
- User can register, receive email verification, verify email
- User can log in and is redirected correctly
- User can complete onboarding
- User can log out
- User can request and complete password reset
- Google OAuth flow navigates correctly
- Protected routes redirect unauthenticated users
- Auth routes redirect authenticated users
- Role guard works
- Sidebar shows role-appropriate navigation
- All shared form, feedback, and layout components exist and match design files
- All API services exist with correct types
- All TanStack Query hooks exist
- No TypeScript errors
- `npm run build` passes

---

## PHASE 3 — All Pages, Blog Editor & Feature Completion

**Scope:** Every public and authenticated page, the full blog editor, RBAC-enforced UI, and all remaining product features. This phase completes the full MVP as defined in PRODUCT_README.md.

### 3.1 — Public Pages

Implement using `PublicLayout` from Phase 2. All data must come from the API services and hooks built in Phase 2. No mocked data.

`src/pages/public/HomePage.tsx`:
- Sections exactly as shown in design files
- Featured blogs, explore section, or hero — follow design files
- Links to explore, blog pages

`src/pages/public/ExplorePage.tsx`:
- Blog listing with filtering by tag
- Pagination or infinite scroll (use `useInfiniteQuery` if infinite scroll)
- Each blog card must match design files exactly
- Loading: skeleton cards
- Empty state: use `EmptyState` component

`src/pages/public/BlogPage.tsx`:
- Route param: blog slug
- Full blog post display
- Author info
- Tags
- Exact typography and layout from design files
- Loading: skeleton matching blog layout
- 404 handling if blog not found

`src/pages/public/TagPage.tsx`:
- Route param: tag slug
- Tag header
- Blog listing filtered by tag
- Same listing pattern as ExplorePage

`src/pages/public/AuthorProfilePage.tsx`:
- Route param: username
- Author info, bio, avatar
- Published blogs by this author
- 404 handling

`src/pages/public/CompanyProfilePage.tsx`:
- Route param: company slug
- Company info
- Company's published blogs
- 404 handling

### 3.2 — Dashboard Pages

All require `AuthGuard`. Implement using `DashboardLayout` from Phase 2.

`src/pages/dashboard/DashboardPage.tsx`:
- Summary stats or recent activity — follow PRODUCT_README.md dashboard requirements exactly
- Quick actions
- Match design files

`src/pages/dashboard/MyBlogsPage.tsx`:
- List of user's published blogs
- Actions: edit, unpublish, delete
- Role-aware: show only actions the user's role permits per PRODUCT_README.md
- Loading: skeleton list
- Empty state

`src/pages/dashboard/DraftsPage.tsx`:
- List of user's draft blogs
- Actions: edit, publish, delete, schedule
- Role-aware actions
- Loading and empty states

`src/pages/dashboard/ScheduledPage.tsx`:
- List of scheduled blogs with scheduled time
- Actions: edit, unschedule, cancel
- Role-aware actions
- Loading and empty states

`src/pages/dashboard/ProfileSettingsPage.tsx`:
- Edit display name, bio, avatar, username, social links — fields from TESTING.md
- Uses React Hook Form + Zod schema from Phase 2
- Shows success/error toast via sonner

### 3.3 — Blog Editor

`src/pages/dashboard/EditorPage.tsx`:
- Route: `/editor` (new) or `/editor/:id` (edit existing)
- On load with id: fetch blog by id, populate form
- On load without id: empty editor for new draft

Editor implementation using `react-quill`:
- Configure Quill with the following modules: toolbar with all standard formatting options (headings H1–H4, bold, italic, underline, strikethrough, blockquote, code-block, ordered list, bullet list, link, image), syntax highlighting module if available in Quill ecosystem, clipboard module
- Full-width editor matching design file editor layout exactly
- Editor must feel clean and distraction-free

Above the editor:
- Blog title input (plain text, large typography matching design)
- Tag selector (multi-select, fetched from tag API)
- Cover image upload field
- Excerpt/description field

Editor toolbar:
- Match design file styling for toolbar
- Sticky on scroll

Sidebar or top action bar:
- Save draft button (auto-saves on change with debounce of 2 seconds using `useBlogMutations`)
- Publish button
- Schedule button (opens a dialog with date/time picker)
- Status indicator (Saved, Saving..., Unsaved changes)

Autosave behavior:
- On every content change, debounce 2 seconds, then call save draft mutation
- Show "Saving..." during mutation, "Saved" on success, "Unsaved changes" on error

Publish flow:
- Validate required fields (title, content not empty)
- Call publish mutation
- On success: redirect to blog public page or my-blogs

Schedule flow:
- Open dialog with date + time picker
- Validate date is in the future
- Call schedule mutation with ISO datetime string
- On success: redirect to scheduled page

Role-aware publishing:
- If user role does not have permission to publish directly per PRODUCT_README.md, show only "Submit for review" or whatever the correct action is per PRODUCT_README.md

### 3.4 — Company Pages

Only shown to users with Company Owner role (enforced by `RoleGuard` and conditional rendering).

`src/pages/dashboard/CompanyDashboardPage.tsx`:
- Company overview
- Follow PRODUCT_README.md company dashboard requirements

`src/pages/dashboard/CompanySettingsPage.tsx`:
- Edit company name, slug, description, logo
- Fields from TESTING.md company endpoints
- Uses React Hook Form + Zod

`src/pages/dashboard/TeamManagementPage.tsx`:
- List team members with role badges
- Invite new member (opens dialog with email + role fields)
- Change member role (inline or dialog)
- Remove member (with confirmation dialog)
- Pending invites list
- All actions match TESTING.md exactly
- Role-aware: show invite/remove/change-role only to Company Owner

### 3.5 — RBAC-Enforced UI (Complete Pass)

After all pages are implemented, do a complete pass to verify RBAC is correctly enforced throughout:

- Every action button (publish, delete, invite, etc.) is conditionally rendered based on user role from PRODUCT_README.md
- Every route is wrapped with the correct guard
- No role can access pages or perform actions above their permission level
- Use a single `usePermissions()` hook in `src/shared/hooks/usePermissions.ts` that returns boolean flags for each action. This centralizes all permission logic. Pages and components use this hook instead of checking role strings directly.

`usePermissions()` must return at minimum:
- `canPublish` — whether the user can publish without review
- `canManageTeam` — whether the user can invite/remove team members
- `canManageCompany` — whether the user can access company settings
- `canDeleteBlog` — whether the user can delete any blog (admin) or only own
- `canSchedule` — whether the user can schedule posts

Define these based on PRODUCT_README.md RBAC rules exactly.

### 3.6 — Notifications Architecture

Create the notifications architecture (does not need to be fully functional if the backend doesn't have a real-time endpoint, but structure must exist).

`src/features/notifications/`:
- `notificationTypes.ts` — TypeScript types for notification objects based on TESTING.md
- `useNotifications.ts` — query hook for fetching notifications list
- `NotificationBell.tsx` — icon with unread count badge, placed in DashboardLayout topbar
- `NotificationDropdown.tsx` — dropdown list of recent notifications, mark as read action

If TESTING.md has a notifications endpoint, wire it up. If not, implement the component structure and leave API call stubs clearly marked with `// TODO: wire to API when endpoint is available`.

### 3.7 — Final Polish Pass

After all pages and features are implemented:

**Loading states:**
- Every page that fetches data shows skeleton loaders while loading
- Every mutation button shows a spinner while the mutation is in progress

**Error states:**
- Every page that fetches data shows `ErrorState` component on query error with retry button
- Every form shows server errors mapped to field-level errors or a global form error via `FormError`

**Toast notifications:**
- All successful mutations show a sonner success toast
- All failed mutations show a sonner error toast with the error message from `ApiError`

**Responsive design:**
- All pages work correctly on mobile, tablet, and desktop
- Sidebar collapses on mobile (behavior using `uiStore`)
- Public pages are fully responsive matching design files
- Editor is usable on tablet

**Accessibility:**
- All interactive elements are keyboard accessible
- All form fields have associated labels
- All images have alt text
- Focus states are visible

### Phase 3 Exit Criteria

The following must be true before Phase 3 is considered complete:
- All public pages are implemented and match design files
- All dashboard pages are implemented
- Blog editor works end-to-end (create, edit, save, publish, schedule)
- Company pages work for Company Owner role
- Team management works
- RBAC is enforced on all pages and actions
- All loading and error states are implemented
- All mutations trigger success/error toasts
- Responsive design works on mobile
- No TypeScript errors
- `npm run build` passes with no errors or warnings

---

## NOTES FOR ALL PHASES

- Never hardcode any API URL outside of `src/config/env.ts`
- Never hardcode any route path string outside of `src/constants/routes.ts`
- Never hardcode any query key string outside of `src/constants/queryKeys.ts`
- Never introduce a color, font, or spacing value not derived from the design files
- Every component must be typed — no `any`
- If TESTING.md and PRODUCT_README.md conflict, prefer TESTING.md for API behavior and PRODUCT_README.md for UX flow
- If design files and PRODUCT_README.md conflict on UX/UI, prefer design files
