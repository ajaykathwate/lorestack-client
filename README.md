# Lorestack — Frontend

> A company-first publishing platform for engineers, founders, and startups.
> Write engineering blogs, architecture deep-dives, postmortems, and build-in-public timelines — as yourself or under your company's brand.

**Live →** _coming soon_

---

## What is Lorestack?

Lorestack is a long-form writing platform built specifically for the people who ship software. It sits somewhere between Medium and a company engineering blog — open for any individual to publish, with a first-class company layer baked in.

Three types of users co-exist on the platform:

| Role | What they do |
|------|-------------|
| **Solo Author** | Writes independently, no company required |
| **Company Author** | Writes under a company brand they've been invited to join |
| **Company Owner** | Creates and manages a company, invites authors, controls all company content |

---

## Screenshots

> Add screenshots here once the app is deployed.

---

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| Server state | TanStack React Query v5 |
| Client state | Zustand |
| Styling | Tailwind CSS 3 + CSS variables design tokens |
| Forms | React Hook Form + Zod |
| Rich text editor | React Quill |
| HTTP client | Axios |
| Real-time | Socket.IO client |
| Image hosting | Cloudinary |
| UI primitives | Radix UI |
| Notifications | Sonner |
| Icons | Lucide React |

---

## Features

### Public
- **Homepage** — featured article hero, trending articles grid, browse by article type, trending tags
- **Explore** — filterable + sortable feed of all articles (by type, tag, date range)
- **Article reader** — clean reading view with reading progress bar, like/save/share, follow author inline
- **Author profiles** — public page with articles, social links, expertise tags, follower stats
- **Company profiles** — blog tab, team tab, build-in-public timeline tab
- **Tag pages** — auto-generated per tag, with all articles and related tags

### Authenticated
- **Rich text editor** — Quill-based, autosave, cover image upload, SEO settings, article type, tags, company picker
- **Draft management** — save, edit, archive, restore, delete
- **Scheduling** — calendar + time picker modal, datetime shown in confirmation toast
- **Notifications** — real-time push + REST feed, mark read, delete, drawer with focus trap
- **Following / followers** — follow authors, companies, tags
- **My Profile** — public profile view with stats, articles, social links
- **Saved articles** — personal reading list
- **Company dashboard** — team management, invite authors, company settings, timeline milestones

### Admin
- Content moderation, featured article curation, tag management, user and company oversight

---

## Project Structure

```
src/
├── api/
│   ├── client/          # Axios instance, error normalisation, isApiError guard
│   ├── hooks/           # TanStack Query hooks (queries + mutations per domain)
│   └── services/        # Thin service wrappers per resource
├── config/              # Env vars, blog config constants
├── constants/           # Routes, query keys, article types
├── layouts/             # PublicLayout, DashboardLayout, AdminLayout, AuthLayout
├── lib/                 # cn(), utility functions (formatDate, notifDeepLink, etc.)
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   ├── errors/
│   └── public/
├── routes/              # createBrowserRouter config + AuthGuard, RoleGuard, GuestGuard
├── shared/
│   ├── components/
│   │   ├── cards/       # BlogFeedCard, etc.
│   │   ├── feedback/    # Spinner, ErrorBoundary
│   │   └── ui/          # UserAvatar, PageContainer, ArticleTypeBadge, …
│   └── NotificationDrawer.tsx
├── store/               # Zustand stores (authStore, uiStore, notificationsStore)
└── types/               # TypeScript API types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [Lorestack backend API](https://github.com/your-org/lorestack-server) _(link when public)_

### 1. Clone and install

```bash
git clone https://github.com/your-org/lorestack-client.git
cd lorestack-client
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=http://localhost:3000      # Your backend API URL
VITE_GOOGLE_CLIENT_ID=                       # Google OAuth client ID
VITE_APP_NAME=Lorestack
VITE_CLOUDINARY_CLOUD_NAME=                  # Your Cloudinary cloud name
VITE_CLOUDINARY_UPLOAD_PRESET=               # Your Cloudinary unsigned upload preset
```

### 3. Run

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |


---

## Architecture Notes

- **URL is the source of truth** for all filter state on Explore and tag pages (`useSearchParams`)
- **TanStack Query** handles all server state — no Redux, no manual cache management
- **Zustand** is used only for auth session state, UI state (sidebar), and real-time notification queue
- **Error boundaries** wrap all layout outlets — a broken page never crashes the whole shell
- **`isApiError()` + `normalizeApiError()`** in `src/api/client/apiError.ts` are the single source of truth for error message extraction — no `(err as any)` casts anywhere
- **`PageContainer`** (`src/shared/components/ui/PageContainer.tsx`) is the shared horizontal padding primitive — all public page sections use `px-4 sm:px-8 lg:px-12`
- **EditorPage** lazy-loaded with `React.lazy()` + `Suspense` to keep the main bundle lean (Quill + marked are heavy)
- **Real-time notifications** arrive via Socket.IO, stored in `notificationsStore`, deduplicated against the REST feed by `id` or `message|createdAt` fingerprint

---

## Contributing

This project is currently in private development. Contribution guidelines will be published when the repo goes public.

---

## License

Copyright (c) 2025 Ajay Kathwate. All rights reserved.

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this codebase, in whole or in part, is strictly prohibited without express written permission.

See the [LICENSE](LICENSE) file for details.
