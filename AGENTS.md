# AGENTS.md

Instructions for AI agents (OpenAI Codex, ChatGPT, etc.) working on this codebase.

## Project Overview

React 19 + TypeScript 6 dashboard starter using **Feature-Sliced Design (FSD)** architecture.
Package manager: **pnpm**. Build tool: **Vite 8** (Rolldown bundler).

## Setup

```bash
pnpm install
pnpm dev        # dev server → http://localhost:3000
pnpm build      # production build (tsc -b && vite build)
pnpm check      # Biome lint + format check (must pass before commit)
pnpm check:fix  # auto-fix all fixable issues
```

Copy `.env.example` → `.env` and set `VITE_API_BASE_URL`.

## Architecture: Feature-Sliced Design

The `src/` directory has exactly 6 layers, ordered by dependency direction:

```
src/
├── app/        Layer 6 — bootstrap, providers, router, global CSS
├── pages/      Layer 5 — page compositions (import widgets + features)
├── widgets/    Layer 4 — complex UI blocks (import features + entities)
├── features/   Layer 3 — user interactions / mutations
├── entities/   Layer 2 — business domain (API, types, stores)
└── shared/     Layer 1 — infrastructure (axios, query, i18n, UI primitives)
```

### Import direction rule

Higher layers import from lower layers only. **Never import upward.**

```
✅ features/auth-login imports from entities/session
✅ widgets/users-table imports from features/user-delete
❌ entities/user imports from features/user-delete   ← forbidden
❌ shared/api imports from entities/session           ← forbidden
```

**Cross-slice imports** (same layer, different slice) are also forbidden:
```
❌ entities/user imports from entities/session
❌ features/auth-login imports from features/user-delete
```

### Slice public API

Every slice exposes its public API via `index.ts`. Always import from the index, not from internal paths:
```ts
// ✅ correct
import { useSessionStore } from '@/entities/session';
// ❌ wrong (bypasses public API)
import { useSessionStore } from '@/entities/session/model/sessionStore';
```

Exception: `shared/api/instance.ts` imports `sessionStore` directly to avoid a circular dependency
through the public index re-export.

## Key Files

| File | Purpose |
|---|---|
| `src/app/main.tsx` | Entry point, mounts `RootProvider` |
| `src/app/providers/index.tsx` | Provider stack: QueryClient → ConfigProvider → AntApp → NuqsAdapter → RouterProvider |
| `src/app/router/index.tsx` | Routes: GuestGuard (login) + AuthGuard (dashboard layout) |
| `src/app/styles/index.css` | TailwindCSS v4 entry + semantic color token definitions |
| `src/shared/api/instance.ts` | Axios instance with auth token injection + 401 refresh queue |
| `src/shared/api/queryClient.ts` | TanStack Query client (staleTime 30s, no retry on 4xx) |
| `src/shared/config/routes.ts` | `ROUTES` constants (`LOGIN`, `DASHBOARD`, `USERS`, etc.) |
| `src/shared/config/antdTheme.ts` | Ant Design v5 theme tokens (light + dark) |
| `src/shared/i18n/index.ts` | i18next init with lazy `resourcesToBackend` |
| `src/entities/session/model/sessionStore.ts` | Zustand auth store (tokens, user, isAuthenticated) |
| `src/entities/settings/model/settingsStore.ts` | Zustand settings store (theme, language, sidebarCollapsed) |
| `src/entities/user/model/userKeys.ts` | TanStack Query key factory for users |

## Semantic Tailwind Classes

This project uses semantic color tokens, not raw palette colors.
All CSS custom properties are defined in `src/app/styles/index.css` `@theme` block
and automatically become Tailwind utilities via TailwindCSS v4.

```tsx
// ✅ Use semantic classes
<div className="bg-background text-foreground border-border">
<Card className="bg-surface">
<p className="text-muted-foreground">
<span className="text-destructive">

// ❌ Don't use raw palette
<div className="bg-gray-50 text-gray-900 border-gray-200">
```

Dark mode is activated by `data-theme="dark"` on `<html>` (managed by `settingsStore`).

## Adding New Pages / Features

### New page with data table

1. **Entity** — add types, API function, query key factory in `src/entities/<name>/`
2. **Feature** — add mutation hook in `src/features/<verb>-<noun>/model/`
3. **Widget** — compose table + filters in `src/widgets/<name>-table/ui/`
4. **Page** — thin composer in `src/pages/<name>/index.tsx`
5. **Route** — register in `src/app/router/index.tsx`, add to `ROUTES`
6. **i18n** — add keys to `src/shared/i18n/locales/en/<ns>.json` and `.../uz/<ns>.json`

### URL filter state (nuqs)

Define parsers at **module level** (stable reference avoids re-renders):
```ts
const statusParser = parseAsStringEnum<Status>(['active', 'inactive'])
  .withDefault('' as Status);

const [status, setStatus] = useQueryState('status', statusParser);
void setStatus(null);  // removes the param from URL
```

### TanStack Query key factory

```ts
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (params: ItemListParams) => [...itemKeys.lists(), params] as const,
  detail: (id: string) => [...itemKeys.all, 'detail', id] as const,
};
```

Invalidate all lists after mutation:
```ts
qc.invalidateQueries({ queryKey: itemKeys.lists() });
```

### Zustand store

```ts
export const useItemStore = create<ItemState>()(
  persist(
    (set) => ({ /* state + actions */ }),
    { name: 'item-storage', storage: createJSONStorage(() => localStorage) },
  ),
);
```

Access outside React (e.g., Axios interceptors): `useItemStore.getState().someField`

## Code Style (enforced by Biome)

- Single quotes for JS/TS strings, double quotes for JSX attributes
- Trailing commas everywhere, semicolons required
- `import type` for type-only imports (`useImportType: "error"`)
- No unused imports or variables
- Template literals over string concatenation

## i18n

Always use `useTranslation('<namespace>')` — never hardcode user-visible strings.
Namespace files: `src/shared/i18n/locales/{en,uz}/<namespace>.json`.

```tsx
const { t } = useTranslation('users');
<Button>{t('page.addUser')}</Button>
```

## AntD Usage

- Use `App.useApp()` for `message`, `notification`, `modal` (requires `<AntApp>` wrapper in providers)
- Theme customization goes in `src/shared/config/antdTheme.ts`
- Never override AntD styles with raw CSS — use `token` and `components` in `ThemeConfig`

## Environment Variables

All must be prefixed `VITE_` and typed in `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}
```

## What Not To Do

- Do not import across FSD layers in the wrong direction
- Do not use raw palette Tailwind classes in components
- Do not use `useStore()` hooks in non-React code — use `.getState()`
- Do not hardcode route strings — use `ROUTES` constants
- Do not skip `pnpm check` before committing — Biome catches type import issues and unused code
- Do not add `console.log` statements — use proper error handling
