# motionql.com

The public website for [MotionQL](https://motionql.com), the desktop IDE for MongoDB: marketing pages, registration, the account page where people get their license key and installers, and the team admin portal.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI primitives in the shadcn/ui style · Motion · TanStack Query · react-hook-form + zod. Hosted on Render.

## Run it

```sh
npm ci
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

With `NEXT_PUBLIC_API_URL` empty, the site runs on a **mock backend** (`src/lib/api/mock.ts`) that stores accounts, keys and teams in your browser's localStorage. You can click through the whole flow (register, verify with the preview link, copy a sample key, create a team, invite, free seats, reissue keys) without a server. Sample keys will not activate the app.

Point `NEXT_PUBLIC_API_URL` at the backend (`motionql-backend`) to use the real API. The backend must allow this origin with credentials (CORS), since the session is an httpOnly cookie.

```sh
npm run lint
npm run typecheck
npm run build
```

## Layout

```
src/app/(marketing)/   Home, features, compare (+ /compare/studio-3t, /compare/compass), pricing, security, download, changelog, legal
src/app/(auth)/        Register, login, verify email, forgot/reset password, accept invite
src/app/(app)/         Signed-in pages: /account, /team/new, /team/[id]
src/components/ui/     Buttons, inputs, dialogs, tabs, menus (shadcn/ui style, on Radix)
src/components/marketing/  Page sections and the animated product window
src/components/app/    License card, download panel, forms
src/lib/api/           API types, HTTP client, mock backend, React Query hooks
content/               CHANGELOG.md and legal documents, copied from the app repo
```

## Deploy (Render)

`render.yaml` is a Render Blueprint: in Render choose **New > Blueprint** and pick this repository. It creates the `xquery-website` web service (the pre-rename name is kept on purpose: renaming it makes Render create a new service), which builds with `npm ci --include=dev && npm run build` (dev dependencies are needed for the build even if `NODE_ENV=production` is set) and runs `npm start`.

- `NEXT_PUBLIC_API_URL` points at the backend's Render service (`https://xquery-api.onrender.com`); change it to `https://api.motionql.com` once that domain is live. Values starting with `NEXT_PUBLIC_` are baked into the build, so trigger a redeploy after changing them.
- Add the custom domain `motionql.com` under the service's **Settings > Custom Domains**.
- The backend's `WEB_ORIGINS` must list `https://motionql.com` and the service's `https://xquery-website.onrender.com` address, or sign-in requests are refused.
- The free plan sleeps after 15 minutes without traffic, so the first visit after that is slow. Switch `plan` to `starter` if that becomes a problem.

## API contract

Every call the site makes is listed in `src/lib/api/index.ts` (`Api` interface) with shapes in `src/lib/api/types.ts`. Errors are `{ "error": { "code", "message", "fields?" } }`. Auth is a session cookie set by the API; the client sends `credentials: "include"` and echoes an `mq_csrf` cookie as `X-CSRF-Token` when present.

## Content to update before launch

- `content/legal/*` are templates from the app repo with placeholders such as `[ADDRESS]`; the legal pages show a "Draft" banner and are `noindex` until no placeholders remain.
- `content/CHANGELOG.md` mirrors the app's changelog.
- The comparison table in `src/lib/content.ts` reflects Studio 3T and Compass public docs as of October 2026.
