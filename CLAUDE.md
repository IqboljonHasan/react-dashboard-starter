# CLAUDE.md

## Keeping These Files Up to Date

**Whenever you make a code change that affects anything documented here — architecture, conventions, patterns, fake data setup, env vars, commands, constraints — update `CLAUDE.md`, `AGENTS.md`, and `.github/copilot-instructions.md` in the same step.**

This applies to: new layers or slices, new shared utilities, changed import rules, new env vars, new query/mutation patterns, changes to the fake data system, routing changes, i18n changes, and any new "never do X" rules discovered during work.

All three files must stay consistent with each other and with the actual codebase.

## Project

React + TypeScript dashboard starter using **Feature-Sliced Design (FSD)** architecture.
Located at `src/` with 6 layers: `app → pages → widgets → features → entities → shared`.

## Commands

```bash
pnpm dev          # dev server on :3000
pnpm build        # tsc -b && vite build
pnpm check        # Biome lint + format check
pnpm check:fix    # auto-fix lint and formatting
pnpm lint         # lint only
pnpm format       # format only
```

## Tech Stack

| Library | Version | Role |
|---|---|---|
| React | 19 | UI |
| TypeScript | 6 | Types (strict) |
| Vite | 8 | Build (Rolldown) |
| Ant Design | 5 | UI components |
| React Router | 6 | Routing |
| TanStack Query | 5 | Server state |
| Axios | 1 | HTTP client |
| nuqs | 2 | URL search-param state |
| Zustand | 5 | Client state |
| TailwindCSS | 4 | Utility CSS |
| Biome | 2 | Lint + format |
| Day.js | 1 | Dates |
| i18next | 26 | i18n (en + uz) |

## FSD Architecture

### Layer import rules (strictly enforced by convention)

```
app       → can import from all layers
pages     → widgets, features, entities, shared
widgets   → features, entities, shared
features  → entities, shared
entities  → shared
shared    → nothing above shared
```

**Cross-slice imports within the same layer are forbidden.**
Example: `entities/user` must NOT import from `entities/session`.

### Layer responsibilities

- **`src/app/`** — app bootstrap, providers (QueryClient, AntD ConfigProvider, NuqsAdapter), router, global CSS
- **`src/pages/`** — thin page composers. Assemble widgets/features. No business logic.
- **`src/widgets/`** — complex UI blocks composed from features/entities (`layout`, `stats-overview`, `users-table`)
- **`src/features/`** — user interactions and mutations (`auth-login`, `auth-logout`, `user-delete`, `settings-form`)
- **`src/entities/`** — business domain models, APIs, stores (`session`, `settings`, `user`, `dashboard-stats`)
- **`src/shared/`** — reusable infrastructure: axios instance, queryClient, i18n, dayjs, config, shared UI components

### Slice structure

Each slice follows this segment pattern:
```
src/<layer>/<slice>/
  api/       HTTP calls (Axios)
  model/     Zustand stores, TanStack Query keys, TypeScript types
  ui/        React components
  index.ts   Public API — only export what other layers need
```

## Path Aliases

`@/` maps to `src/`. Always use `@/` for cross-layer imports.

```ts
import { useSessionStore } from '@/entities/session';
import { userKeys } from '@/entities/user';
import { apiClient } from '@/shared/api/instance';
```

## Semantic Theming

All components use semantic Tailwind class names derived from CSS custom properties.
**Never use raw palette classes** like `bg-gray-50` or `text-gray-900` in component code.

### Available semantic tokens

```
bg-background          text-foreground
bg-surface             bg-surface-raised
bg-sidebar             text-sidebar-foreground
bg-header
bg-muted               text-muted-foreground
border-border          ring-ring
bg-primary             text-primary-foreground
text-success           text-warning
text-destructive       text-destructive-foreground
```

### Dark mode

Controlled by `data-theme="dark"` on `<html>`, set reactively in `src/app/providers/index.tsx`
from `useSettingsStore().theme`. System preference also respected via `@media (prefers-color-scheme: dark)`.

## State Management

### Server state — TanStack Query

- Define query keys in `<entity>/model/<entity>Keys.ts` using the factory pattern
- Use `placeholderData: (prev) => prev` for pagination to avoid flickering
- Invalidate with `queryClient.invalidateQueries({ queryKey: entityKeys.lists() })` after mutations
- `staleTime: 30s`, `gcTime: 5min`, skips retry on 4xx

### Client state — Zustand

- One store per entity slice: `sessionStore`, `settingsStore`
- Use `persist` middleware with `partialize` for localStorage persistence
- Access stores **outside React** with `useStore.getState()` (e.g., in Axios interceptors)

### URL state — nuqs

- Filter/pagination state lives in the URL via `useQueryState`
- Define parsers at **module level** (stable reference = no re-renders):
  ```ts
  const roleParser = parseAsStringEnum<UserRole>(['admin', 'manager', 'viewer'])
    .withDefault('' as UserRole);
  ```
- Reset a param by setting it to `null`: `void setSearch(null)`

## HTTP / Axios

- Instance: `src/shared/api/instance.ts`
- Request interceptor injects `Authorization: Bearer <token>` from `sessionStore.getState()`
- Response interceptor handles 401 + token refresh with a queue (prevents duplicate refresh calls)
- On refresh failure: calls `logout()` and rejects all queued requests
- Errors are normalized to `Error & { status: number }` for TanStack Query retry logic

## Routing

Guards are layout routes in `src/app/router/index.tsx`:
- `GuestGuard` — redirects authenticated users to `/dashboard`
- `AuthGuard` — redirects unauthenticated users to `/login`, preserves `location.state.from` for post-login redirect

All route paths are constants in `src/shared/config/routes.ts`:
```ts
ROUTES.LOGIN / ROUTES.DASHBOARD / ROUTES.USERS / ROUTES.REPORTS / ROUTES.SETTINGS
```

## Internationalisation

- Config: `src/shared/i18n/index.ts`
- Namespaces: `common`, `auth`, `dashboard`, `users`, `settings`
- Locales: `src/shared/i18n/locales/{en,uz}/<namespace>.json`
- Lazy-loaded via `resourcesToBackend` — only the active locale's chunks download
- Language detection order: `localStorage → navigator → htmlTag`
- Switch language: `useSettingsStore().setLanguage(lang)` + `i18n.changeLanguage(lang)`

## Fake Data

The app has a runtime fake-data layer so the UI can be developed and demoed without a live API.

### How it works

- `VITE_FAKE_DATA=true` in `.env` sets the initial state; it can be overridden at runtime.
- `src/shared/fake-data/model/fakeDataStore.ts` — Zustand store (`enabled` boolean), persisted to `localStorage` as `fake-data`.
- `src/shared/fake-data/ui/FakeDataProvider.tsx` — mounted inside `<AntApp>` in `src/app/providers/index.tsx`; renders only when `import.meta.env.DEV`.
- A **"Fake: ON / OFF" button** is fixed to the bottom-left of the screen in dev mode. Clicking it toggles the store and calls `queryClient.invalidateQueries()` so all data refreshes immediately.

### Query hooks

Every entity query hook (`useStatsQuery`, `useUsersQuery`, `useUserQuery`) accepts an optional `fakeData` prop:

```ts
// explicit override (highest priority)
useStatsQuery({ fakeData: myCustomStats })

// falls back to store when no prop is given
useStatsQuery()
```

Priority order: **explicit `fakeData` prop → store `enabled` → real API call.**

`isFake` is included in the `queryKey` so toggling always triggers a fresh fetch rather than serving stale cached data.

### Mutation hooks

`useCreateUser`, `useUpdateUser`, `useDeleteUser` read `useFakeDataStore.getState().enabled` at call time inside `mutationFn`. No network request is made when fake mode is on.

### Fake data files

| Entity | File |
|---|---|
| `dashboard-stats` | `src/entities/dashboard-stats/model/fakeData.ts` |
| `user` | `src/entities/user/model/fakeData.ts` |

`user/model/fakeData.ts` also exports `applyFakeUserFilters(params)` which filters, sorts, and paginates the in-memory list so URL-driven filters work in fake mode.

### Keeping fake data up to date

**When a TypeScript type changes** (field added, renamed, or removed), update every `fakeData.ts` that uses it so it stays assignable and representative.

**When a screenshot is provided**, extract realistic values from it and use those in the fake data instead of placeholder numbers. Match field names exactly to the entity type.

**When adding a new entity**, create `src/entities/<name>/model/fakeData.ts` alongside the API file, export it from the slice's `index.ts`, add fake-data branching to the query hook, and add a row to the table above.

## Adding a New Feature

### 1. Add the entity (if new business domain)

```
src/entities/<name>/
  api/<name>Api.ts       # Axios calls
  model/types.ts         # TypeScript interfaces
  model/<name>Keys.ts    # TanStack Query key factory
  model/fakeData.ts      # static fake records; keep in sync with types.ts
  model/use<Name>Query.ts  # query hook with fakeData prop + store branching
  index.ts               # export public API
```

### 2. Add the feature (user interaction / mutation)

```
src/features/<verb>-<noun>/
  model/use<Action>.ts   # useMutation hook
  ui/<Action>Button.tsx  # trigger component
  index.ts
```

### 3. Add the widget (composed UI block)

```
src/widgets/<name>/
  ui/<Name>Table.tsx     # or Card, Form, etc.
  ui/<Name>Filters.tsx   # if URL filter state needed
  index.ts
```

### 4. Add the page (thin composer)

```
src/pages/<name>/index.tsx
```

Register in `src/app/router/index.tsx` and add ROUTES constant.

### 5. Add translations

Add keys to both `src/shared/i18n/locales/en/<namespace>.json`
and `src/shared/i18n/locales/uz/<namespace>.json`.

## Biome (Lint + Format)

Config: `biome.json`. Key rules:
- `useImportType: "error"` — always use `import type` for type-only imports
- `noUnusedImports: "error"` — no dead imports
- `noNonNullAssertion: "warn"` — prefer explicit null checks
- `quoteStyle: "single"`, `trailingCommas: "all"`, `semicolons: "always"`
- CSS: `tailwindDirectives: true` — allows `@theme`, `@layer`, `@import "tailwindcss"`

Run `pnpm check:fix` to auto-fix all fixable issues before committing.

## TypeScript Config Notes

- `tsconfig.app.json` — source files; includes `"ignoreDeprecations": "6.0"` for `baseUrl` (deprecated in TS6)
- `tsconfig.node.json` — `vite.config.ts` only; includes `"types": ["node"]`
- `vite-env.d.ts` — declares `ImportMetaEnv` with all `VITE_*` vars

## Critical Constraints

1. **TailwindCSS v4 + AntD** — `@layer theme, base, antd, components, utilities` MUST appear before `@import "tailwindcss"` in `src/app/styles/index.css`
2. **nuqs adapter** — `NuqsAdapter` wraps `RouterProvider`, not the other way around
3. **Zustand outside React** — use `.getState()`, never hooks, in Axios interceptors or non-component code
4. **Vite 8 Rolldown** — `manualChunks` must be a function, not a plain object
5. **TypeScript 6** — `baseUrl` requires `"ignoreDeprecations": "6.0"` in tsconfig
