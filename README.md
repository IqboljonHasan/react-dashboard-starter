# React Dashboard Starter

A production-ready React dashboard template built with Feature-Sliced Design (FSD), TypeScript, Ant Design, and TailwindCSS v4.

## Tech Stack

| | |
|---|---|
| React 19 | UI |
| TypeScript 6 | Strict types |
| Vite 8 (Rolldown) | Build |
| Ant Design 5 | Component library |
| TailwindCSS 4 | Utility CSS with semantic tokens |
| TanStack Query 5 | Server state & caching |
| Zustand 5 | Client state |
| React Router 6 | Routing with auth guards |
| nuqs 2 | URL search-param state |
| Axios 1 | HTTP client with token refresh |
| i18next 26 | i18n — English + Uzbek |
| Day.js 1 | Date formatting |
| Biome 2 | Lint + format |

## Requirements

- Node.js ≥ 20.19.0
- pnpm

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL to your backend

# 3. Start dev server
pnpm dev
# → http://localhost:3000
```

## Environment Variables

All vars are prefixed `VITE_` and typed in `src/vite-env.d.ts`.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Backend base URL |
| `VITE_APP_NAME` | `Dashboard` | App title |
| `VITE_APP_VERSION` | `0.0.0` | Displayed version |
| `VITE_FAKE_DATA` | `false` | Start with fake data instead of real API |

## Commands

```bash
pnpm dev          # dev server on :3000 with HMR
pnpm build        # type-check + production build
pnpm preview      # preview the production build locally
pnpm check        # Biome lint + format check
pnpm check:fix    # auto-fix all fixable issues
pnpm lint         # lint only
pnpm format       # format only
```

Run `pnpm check:fix` before committing. Husky enforces this via a pre-commit hook and commitlint validates commit messages.

## Project Structure

This project follows [Feature-Sliced Design](https://feature-sliced.design/). Each layer may only import from layers below it — never upward, never sideways within the same layer.

```
src/
├── app/         Bootstrap — providers, router, global styles
├── pages/       Thin page composers — assemble widgets and features
├── widgets/     Complex UI blocks — stats overview, users table, layout
├── features/    User interactions and mutations — login, delete user, settings form
├── entities/    Business domain — API calls, types, query keys, stores
└── shared/      Infrastructure — Axios instance, query client, i18n, UI primitives
```

### Slice anatomy

Every slice (e.g. `entities/user`) follows this internal structure:

```
<slice>/
  api/       Axios functions
  model/     Types, Zustand stores, TanStack Query keys, query/mutation hooks
  ui/        React components
  index.ts   Public API — only export what other layers need
```

## Fake Data Mode

The app ships with a fake-data layer so you can build and demo the UI without a running backend.

**Enable at startup** — set `VITE_FAKE_DATA=true` in `.env`.

**Toggle at runtime** — a **"Fake: ON / OFF"** button appears at the bottom-left of the screen in dev mode. Clicking it switches modes and immediately refreshes all data.

The setting is persisted in `localStorage` so it survives page reloads.

Each entity exposes a query hook that accepts an optional `fakeData` prop for one-off overrides:

```ts
useStatsQuery({ fakeData: myCustomStats })  // override for this call only
useStatsQuery()                              // uses the toggle state
```

Fake data lives in `src/entities/<name>/model/fakeData.ts` and must be kept in sync with the entity's `types.ts`.

## Authentication

The app uses JWT access + refresh tokens stored in a Zustand store (`sessionStore`) and persisted to `localStorage`.

- `AuthGuard` — redirects unauthenticated users to `/login`, preserves the intended destination
- `GuestGuard` — redirects authenticated users away from `/login` to `/dashboard`
- Axios interceptor injects `Authorization: Bearer <token>` on every request
- On 401, the interceptor silently refreshes the token and retries queued requests

**Demo credentials** (fake-data mode):

| Email | Password | Role |
|---|---|---|
| admin@example.com | password | Admin |
| manager@example.com | password | Manager |
| viewer@example.com | password | Viewer |

## Theming

Dark mode is toggled via `data-theme="dark"` on `<html>`. It follows the system preference by default and can be overridden in Settings.

All components use semantic Tailwind classes backed by CSS custom properties. Never use raw palette classes like `bg-gray-50` — use the semantic tokens:

```
bg-background    text-foreground
bg-surface       bg-surface-raised
bg-muted         text-muted-foreground
border-border
bg-primary       text-primary-foreground
text-success     text-warning     text-destructive
```

## Internationalisation

Supported locales: **English** (`en`) and **Uzbek** (`uz`). Locale chunks are lazy-loaded — only the active language downloads.

Language is detected from `localStorage → browser preference → html lang attribute` and can be changed in Settings.

Translation files live in `src/shared/i18n/locales/{en,uz}/<namespace>.json`. Namespaces: `common`, `auth`, `dashboard`, `users`, `settings`.

## Adding a New Feature

See [CLAUDE.md](CLAUDE.md) for the full step-by-step guide. The short version:

1. **Entity** — types, API functions, query key factory, fake data, query hook in `src/entities/<name>/`
2. **Feature** — mutation hook (+ optional UI trigger) in `src/features/<verb>-<noun>/`
3. **Widget** — composed table or card in `src/widgets/<name>/`
4. **Page** — thin composer in `src/pages/<name>/`, registered in the router
5. **i18n** — keys added to both `en` and `uz` locale files

## Commit Convention

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) and are enforced by commitlint:

```
feat: add user export
fix: correct pagination offset
chore: update dependencies
```
