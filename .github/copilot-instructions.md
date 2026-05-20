# GitHub Copilot Instructions

## Project Context

React 19 + TypeScript 6 dashboard using **Feature-Sliced Design (FSD)**.
Monorepo-free single app at `src/` with strict layer-based architecture.

## Tech Stack (quick reference)

- **UI**: Ant Design 5 + TailwindCSS 4 (semantic tokens)
- **Routing**: React Router 6 with `AuthGuard` / `GuestGuard` layout routes
- **Server state**: TanStack Query 5 with key factories
- **Client state**: Zustand 5 with `persist` middleware
- **URL state**: nuqs 2 (`useQueryState` hooks)
- **HTTP**: Axios with automatic token refresh
- **i18n**: i18next + react-i18next, namespaces: `common auth dashboard users settings`
- **Lint/Format**: Biome 2 (replaces ESLint + Prettier)
- **Dates**: Day.js with `relativeTime`, `localizedFormat`, `utc`, `timezone`, `duration`

## FSD Layer Structure

```
src/app/        ← providers, router, styles (imports everything)
src/pages/      ← thin page composers (import widgets + features)
src/widgets/    ← complex UI blocks (import features + entities)
src/features/   ← user interactions, mutations (import entities + shared)
src/entities/   ← domain: types, API, query keys, stores (import shared)
src/shared/     ← infrastructure only (imports nothing above)
```

**Rule**: each layer only imports from layers below it. No cross-slice imports within a layer.

## Path Alias

`@/` → `src/`. Use it everywhere for non-relative imports.

## Coding Patterns

### React Query — always use key factories

```ts
// src/entities/product/model/productKeys.ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};
```

### Mutations — use `App.useApp()` for feedback

```ts
export function useCreateProduct() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation('products');

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      message.success(t('createSuccess'));
    },
  });
}
```

### URL filter state — nuqs

```ts
// parsers at module level (avoids re-render on every keystroke)
const statusParser = parseAsStringEnum<Status>(['active','inactive']).withDefault('' as Status);

export function ProductFilters() {
  const [status, setStatus] = useQueryState('status', statusParser);
  // setStatus(null) removes the param from the URL
}
```

### Table with URL pagination

```ts
const [page, setPage]         = useQueryState('page', parseAsInteger.withDefault(1));
const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(20));

const { data, isFetching } = useQuery({
  queryKey: productKeys.list({ page, pageSize, ...filters }),
  queryFn: () => productApi.list({ page, pageSize, ...filters }),
  placeholderData: (prev) => prev,  // keeps old rows visible during page transitions
});
```

### Zustand stores

```ts
export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      selectedId: null,
      setSelectedId: (id) => set({ selectedId: id }),
    }),
    { name: 'product-storage', storage: createJSONStorage(() => localStorage) },
  ),
);

// Outside React components (e.g. in Axios interceptors):
useProductStore.getState().selectedId
```

### Axios API functions

```ts
// src/entities/product/api/productApi.ts
export const productApi = {
  list:     (params: ProductListParams) =>
              apiClient.get<PaginatedResponse<Product>>('/products', { params }).then(r => r.data),
  getById:  (id: string) =>
              apiClient.get<Product>(`/products/${id}`).then(r => r.data),
  create:   (payload: CreateProductPayload) =>
              apiClient.post<Product>('/products', payload).then(r => r.data),
  update:   (id: string, payload: Partial<Product>) =>
              apiClient.patch<Product>(`/products/${id}`, payload).then(r => r.data),
  delete:   (id: string) =>
              apiClient.delete(`/products/${id}`).then(r => r.data),
};
```

### Translation — always i18n, never hardcoded strings

```tsx
const { t } = useTranslation('products');
// ...
<Button>{t('page.addProduct')}</Button>
<Empty description={t('table.noData')} />
```

Add keys to both `src/shared/i18n/locales/en/<ns>.json` and `.../uz/<ns>.json`.

### Semantic Tailwind — no raw palette

```tsx
// ✅ correct
<div className="bg-surface text-foreground border border-border rounded-xl p-4">
<p className="text-muted-foreground text-sm">
<span className="text-destructive font-medium">

// ❌ wrong
<div className="bg-white text-gray-900 border border-gray-200 rounded-xl p-4">
```

Available tokens: `background`, `foreground`, `surface`, `surface-raised`, `sidebar`,
`sidebar-foreground`, `header`, `muted`, `muted-foreground`, `border`, `ring`,
`primary`, `primary-foreground`, `success`, `warning`, `destructive`, `destructive-foreground`.

## File Naming & Location

When adding a new domain `product`:

```
src/entities/product/
  api/productApi.ts
  model/types.ts
  model/productKeys.ts
  ui/ProductBadge.tsx      (optional small display component)
  index.ts                 (re-export public API only)

src/features/product-create/
  api/                     (if mutation needs separate endpoint logic)
  model/useCreateProduct.ts
  ui/CreateProductForm.tsx
  index.ts

src/features/product-delete/
  model/useDeleteProduct.ts
  index.ts

src/widgets/products-table/
  ui/ProductsTable.tsx     (nuqs + useQuery)
  ui/ProductsFilters.tsx   (nuqs filter state)
  index.ts

src/pages/products/
  index.tsx                (composes widgets + features, calls PageTitle)
```

## TypeScript Rules

- Always use `import type` for type-only imports — Biome enforces this
- No `any` — use `unknown` and narrow with type guards
- Props interfaces are defined inline or in the same file (no separate `types.ts` for component props)
- Entity types live in `entities/<name>/model/types.ts`

## Comments

Write comments only when the **why** is non-obvious (hidden constraint, workaround, subtle invariant).
Do not comment what the code does — names should be self-documenting.

## AntD Component Notes

- `Form` — always use `Form.Item` with `name` prop for validation
- `Table` — define `columns` outside render for stable references; use `rowKey="id"`
- `Modal`, `message`, `notification` — only via `App.useApp()` hook (requires `<AntApp>` context)
- `Dropdown` — pass `menu={{ items }}`, not the deprecated `overlay` prop
- Custom styles — use `token` / `components` in `antdTheme.ts`, not className overrides

## Routing

Protected routes use layout-route guards:
```tsx
// AuthGuard redirects to /login if not authenticated
// GuestGuard redirects to /dashboard if already authenticated
```

After login success, redirect to `location.state.from` (the page the user tried to access before being kicked).

Route constants:
```ts
import { ROUTES } from '@/shared/config/routes';
navigate(ROUTES.USERS);
```
