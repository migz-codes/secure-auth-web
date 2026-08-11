# CLAUDE.md

Conventions for this repo. Several are non-obvious and easy for tooling to violate.

Frontend of a **JWT authentication study project**: sign-in, sign-up, session probe, protected views. Nothing else belongs here.

Companion API: `../secure-auth-api` (NestJS, port 3001). The cookie contract in *Auth* below is shared with it — changing a cookie name, flag, or path is a breaking change on both sides. Read that repo's `CLAUDE.md` before touching anything auth-related.

## Package management

- **Bun, not npm.** Use `bun add` / `bun remove` / `bun run`.
- **Exact versions, no `^` or `~`.** `.npmrc` sets `save-exact=true`. `typescript: "^5"` predates that rule — pin it on the next touch, don't copy the pattern.
- A stale `package-lock.json` is checked in. `bun.lock` is authoritative; do not update or reason from the npm lockfile.

## Code style — Biome, not ESLint/Prettier

`biome.json` is authoritative. There is no ESLint config and no Prettier.

- **No semicolons** (`semicolons: "asNeeded"`)
- Single quotes, **including in JSX** (`jsxQuoteStyle: "single"` — `className='…'`, not `className="…"`)
- No trailing commas
- 2-space indent
- `lineWidth: 100`
- Biome's `next` and `react` lint domains are on

`bun run format` is `biome format --write` — formatting only. `bun run lint` is `biome lint` — no type-check step, so run `bunx tsc --noEmit` yourself before calling a change done.

## Next.js

- **Next 15.5, App Router**, Turbopack for both `dev` and `build`.
- **React 19 with the React Compiler enabled** (`experimental.reactCompiler`). Do not hand-write `useMemo`, `useCallback`, or `memo` — the compiler inserts memoization, and manual wrappers fight it.
- Path alias `@/*` → `./src/*`. Use it; no `../../..` climbing out of a component folder.

### Route files are thin

Everything under `src/app/` is a re-export plus metadata. No markup, no logic:

```typescript
// src/app/page.tsx
import type { Metadata } from 'next'
import { Auth } from '@/components/pages/Auth'

export const metadata: Metadata = { title: 'Sign in' }

export default Auth
```

`src/app/layout.tsx` does the same with `AppLayout`. Real components live in `src/components/`.

### Component layout

One component per folder, always `index.tsx`, always a **named export**. `default` exports exist only in `src/app/` route files.

```
src/components/pages/Auth/
├── index.tsx          → export const Auth
├── Field/
│   └── index.tsx      → export const AuthField + IAuthFieldProps
└── SignIn/
    └── index.tsx      → export const AuthSignIn + IAuthSignInProps
```

- **No sibling `types.ts`.** The props interface is declared in `index.tsx`, above the component, named `I<ComponentName>Props` and exported. A folder holds one file.
- Component names carry the folder path: `Auth/SignIn` exports `AuthSignIn`, `Auth/Field` exports `AuthField`.
- Extend the shared helpers in `src/types/react.types.ts` (`TInputProps`, `TDivProps`, `TButtonProps`, `IChildrenProps`, …) instead of redeclaring DOM prop types.
- `'use client'` goes on the leaf that owns state or handlers, not on a parent to cover its children.

`src/components/pages/SignIn/` is dead — superseded by `Auth/SignIn`. Do not extend it; delete it when convenient.

## Styling — Tailwind v4

CSS-first configuration. **There is no `tailwind.config.ts`** and adding one is a mistake.

- Design tokens are `@theme` blocks in `src/styles/themes/*.css` (`colors.css`, `fonts.css`, `breakpoints.css`), imported by `src/styles/globals.css`. New colors go there, not into a config file or an inline hex.
- `src/styles/**` is excluded from Biome — do not expect it to be formatted or linted.
- `html { font-size: 62.5% }` in `base.css`, so `rem` math is non-standard. That is why the codebase uses arbitrary pixel values (`p-[16px]`, `h-[48px]`, `rounded-[8px]`, `text-[14px]`). Match that; do not mix in `p-4`-style scale utilities.
- Font is `next/font` Fira Code → `--fira-code-font` → `--font-primary`, applied to `*` in `base.css`.
- Conditional or merged class strings go through `tw()` (`twMerge`) from `@/utils/tailwind`.

---

# Auth

The client half of the contract. The API enforces everything; this app cannot and must not hold a credential.

## The one rule

**This app never sees a token.** `access_token` and `refresh_token` are `HttpOnly` cookies set by the API. They are unreadable from JavaScript by construction.

Consequences, all non-negotiable:

- No `localStorage`, no `sessionStorage`, no cookie writing, no in-memory token variable, no `Authorization` header.
- Nothing decodes a JWT here. There is no client-side expiry check — the API answers 401 and that is the signal.
- If you are writing `setToken`, `getToken`, or a `token` field in a store, you are working against this document.

## Topology

`app.example.com` (this app) and `api.example.com` (the API) — two deploys, two hosts, **one registrable domain**. That makes them same-site, so the auth cookies are first-party and `SameSite=Lax` holds.

- `NEXT_PUBLIC_API_URL` must point at a host on the same registrable domain as this app in production. A `*.vercel.app` URL paired with a `*.railway.app` API is cross-site (both are Public Suffix List entries) and the cookies will be silently dropped. Custom domains on both sides are mandatory.
- Do **not** add a Next route handler or rewrite that proxies the API. It changes which host owns the cookies and breaks the contract on both sides.

## Fetching

Every call to the API needs `credentials: 'include'`. Without it the browser sends no cookies and every request is an anonymous 401 — this is the single most common failure mode here.

Mutations (`POST`, `PUT`, `PATCH`, `DELETE`) additionally need the CSRF header:

```typescript
// csrf_token is the one cookie that is NOT HttpOnly — it exists to be read
const csrf = document.cookie
  .split('; ')
  .find((c) => c.startsWith('csrf_token='))
  ?.split('=')[1]

await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf ?? '' }
})
```

`POST /auth/login` and `POST /auth/register` are the only mutations exempt from the CSRF header — no session exists yet.

Wrap this in one shared client module rather than repeating it per call site; a call that forgets `credentials` or the header fails in a way that looks like a session bug.

## Session state

**`GET /auth/me` returning 200 is the definition of "logged in".** There is no token to inspect, so session state is whatever that probe last said.

- Log in / sign up: `POST /auth/login` or `/auth/register`, read `user` from the response body (the body carries the user object and nothing else), store it in client state.
- Log out: `POST /auth/logout`, then drop the client state. JavaScript cannot clear the cookies — only the API's `Set-Cookie` can.
- On 401 from any call: fire `POST /auth/refresh` **once**, then retry the original request once. If refresh also fails, clear state and route to sign-in.
- The refresh call must be single-flight. Several components hitting 401 at the same time must share one in-flight refresh promise, or the concurrent calls trip the API's token-reuse detector and log the user out of every device.

## Route protection is client-side only

The auth cookies are host-only on the API's domain, so this app's Next.js server never receives them.

- **Server Components and Middleware cannot read the session.** No `cookies()` check, no middleware redirect based on auth, no server-side data fetch that assumes a user.
- Authenticated data is fetched from Client Components after the `/auth/me` probe resolves.
- Any client-side guard is **UX, not security**. It hides a view; it does not protect data. The API is the only enforcement point, and every protected endpoint must be assumed reachable directly.
