# Konnect Service Hub — take-home exercise

A Vue 3 + TypeScript implementation of the Service Hub catalog from the
[Core UI Team Project mock](https://www.figma.com/file/swzJVL624G434CVdWi3FLv/Core-UI-Team-Project).

## Quick start

```sh
pnpm install

# Terminal 1 — mock API on :4001
pnpm dev:server

# Terminal 2 — Vue app
pnpm dev:ui
```

Quality gates: `pnpm test` (55 tests), `pnpm build` (runs lint, stylelint, typecheck and the production build).

---

## Submission notes

### What's implemented

- **Service catalog** matching the mock: status badge (`Published to portal` / `Unpublished` / `In progress`), versions pill, name, two-line clamped description, metrics with the green bullets, and developer avatars with a `+N` overflow chip
- **Search** through the API's `q` parameter (name, description and type are searchable server-side), debounced at 250 ms
- **Client-side pagination**, 9 cards per page as in the mock (`1 to 9 of 42 services`), with boundary-disabled round arrow buttons
- **Service detail route** (`/services/:id`) — summary panel plus a versions list (semver, description, type chip, developer, relative "updated" time). The mock doesn't cover this view, so the design extrapolates the catalog's visual language
- **Create Service Package** opens an explanatory modal dialog (focus management, `Esc`/backdrop close, body scroll lock)
- **Loading skeletons**, **error state with retry**, **empty state** ("clear search" when a query produced it), and a **not-found** page/state for unknown routes and ids
- **Responsive**: 3 / 2 / 1-column grid, header controls reflow, nav collapses to icons (labels stay available to screen readers)

### Design decisions

- **Composition API with `<script setup>` everywhere.** The starter's `defineComponent` files were migrated; SFC + `script setup` is current Vue best practice and what Kong's own UI code uses.
- **Typed domain model** ([src/types/service.ts](src/types/service.ts)) mirrors the API payload, with optionality encoded where the data actually omits values (`metrics`, `version.developer`). The UI status is *derived* once in `getServiceStatus()` instead of scattering `published`/`configured` conditionals through templates.
- **Data layer as composables.**
  - [`useServices(query)`](src/composables/useServices.ts) fetches the list and refetches when the (debounced) query changes. In-flight requests are aborted when superseded — a slow earlier response can never overwrite newer results (the classic search race condition).
  - [`useService(id)`](src/composables/useService.ts) powers detail deep-links. The mock API has no `GET /services/:id`, so it narrows the collection with `?q={id}` (ids are searchable) and exact-matches — avoiding a full-catalog fetch per detail view.
  - [`usePagination(items, pageSize)`](src/composables/usePagination.ts) is a small generic for the required client-side pagination; it resets when the source list changes.
- **No Pinia (deliberately).** All state here is route-local; there is no cross-view shared state that would justify a store. Instead, the catalog view is kept alive (`KeepAlive`) so search + page survive navigating into a service and back. If the app grew (auth/user context, cross-page filters, cached entities), Pinia is where I'd reach first — the composables' return shape would port to a store almost 1:1. The starter's unused example store and the Pinia dependency were removed rather than left as dead code.
- **Design tokens as SCSS variables** ([src/assets/styles/_variables.scss](src/assets/styles/_variables.scss)), injected via Vite's `additionalData` so every component sees them without imports, and typos fail the build (unlike CSS custom properties, which fail silently at runtime).
- **Pixel fidelity**: the Figma file is view-only (no Dev Mode inspection), so colors, spacing and sizes were sampled from the delivered mock render (card grid 426×232 @ 40 px gutters, nav gradient `#092251 → #083481`, brand `#07a88d`, etc.), and the logo/icons use the original exported SVG geometry.
- **Production-API mindset**: aborted stale requests, error + retry paths, malformed-payload guard, empty states, and avatar `onerror` fallback to initials — the mock data actually contains dead `cloudflare-ipfs.com` avatar URLs, so the fallback is exercised for real.
- **Accessibility**: semantic landmarks, `aria-label`s on icon-only buttons, `aria-live` pagination summary, focus-visible rings throughout, modal focus trap-and-restore, and the whole card is a real link (keyboard + middle-click friendly).

### Assumptions

- Status mapping per the acceptance criteria: not configured → `In progress`; configured → `Published to portal` / `Unpublished`. Unconfigured services show "Not configured with runtime yet" in place of metrics.
- Developer avatars only appear on **published** services (matches both the criteria and the data — unpublished versions carry no `developer`).
- The versions pill is hidden when a service has no versions (matches the mock's "In progress" cards).
- Duplicate developers across versions are de-duplicated before rendering the avatar stack.
- Metric formatting follows the mock: `0.83ms latency`, `99.98% uptime`, `23k requests · 3.74% errors` (compact, lowercase suffix).
- "Learn more" links to the public Service Hub docs; the nav items (Organization / Settings / user) are decorative, per the mock's scope.
- Page size is fixed at 9 (the mock's `1 to 9 of 42`).

### Trade-offs & what I'd do next

- **Pagination is client-side** (per the requirements). With a real API I'd move it server-side (`?page=&size=` or cursors) and likely fold search + pagination into one query-driven composable.
- **Detail data comes from the search endpoint.** Fine for the exercise; a production API should expose `GET /services/:id` (and the catalog payload would likely be a slimmer projection).
- **Testing** focuses on behavior: composables (fetching, races, pagination), formatting utils, and component states (loading / error / empty / results, search debounce, pagination interaction, avatar fallback). With more time: Playwright e2e against the real mock server, axe accessibility audit, and visual regression on the card grid.
- **The detail view design is my own** — in a real project that's a conversation with design before building.
- Versions sort newest-first by `updated_at`; the API doesn't specify an order.

### Repo housekeeping

- Conventional commits throughout (`feat:`, `test:`, `docs:`, `chore:`); the starter scaffold was imported as a baseline commit first so the diff that follows is all exercise work.
- `pnpm build` passes type checking, ESLint and Stylelint cleanly; `pnpm test` runs the 55-test suite.

---

## Original starter documentation

<details>
<summary>Setup, linting, testing and commit guidance from the original README</summary>

### pnpm

This repository uses [`pnpm`](https://pnpm.io) rather than `npm` or `yarn`. [See here for instructions on installing pnpm](https://pnpm.io/installation).

### Install dependencies

```sh
pnpm install
```

### Compile and Hot-Reload for Development

Start the backend which serves the `services` API:

```sh
pnpm dev:server
```

In a separate terminal, start the Vue app:

```sh
pnpm dev:ui
```

### Searching the services endpoint

The local API is available at `http://localhost:4001` after running `pnpm dev:server`.

Searching this endpoint is supported by passing a query string with a value to search with (case-insensitive): `/api/services?q={value}`

**Note**: The search endpoint evaluates all property values as a `string` to determine a match.

#### Searchable properties

The search endpoint is configured to search the following fields for each service within the JSON response:

```ts
{
  id: string;
  name: string;
  description: string;
  type: string;
}
```

#### Search example

If I wanted to search for a service with "dogs" in the service name, I would pass the name in the query string:

```sh
GET: /api/services?q=dogs
```

### Linting and fixing the code

#### ESLint

```sh
# Run the linter
pnpm lint

# Fix linting errors
pnpm lint:fix
```

#### Stylelint

```sh
# Run stylelint
pnpm stylelint

# Fix stylelint errors
pnpm stylelint:fix
```

### Run Component and Unit Tests with [Vitest](https://vitest.dev/) and optionally [Vue Test Utils](https://test-utils.vuejs.org/)

Component and unit test files must be located in the `/src/` directory and have a filename format of `*.spec.ts`.

```sh
# Run tests
pnpm test

# or run the tests in the Vitest UI
pnpm test:open
```

### Build and Minify for Production

```sh
pnpm build
```

### Preview your built application

First, you'll need to build the app

```sh
pnpm build
```

Next, run the API server

```sh
pnpm dev:server
```

Now run the `preview` command

```sh
pnpm preview
```

### Committing Changes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

At Kong, we utilize [Conventional Commits](https://www.conventionalcommits.org/) in all of our repositories. [Commitizen](https://github.com/commitizen/cz-cli) can be used to to help build and enforce commit messages.

If you're unfamiliar with conventional commits, it is **recommended** to use the following command in order to create your commits:

```sh
# Stage your changes
git add -A

# Trigger the commitizen CLI to help compose your commit message
pnpm commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

</details>
