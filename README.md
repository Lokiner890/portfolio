# PROJECT_NAME
TODO add project name

## Starting a new project from this template
Create the repository with **Use this template** on GitHub, go through the list, then delete this section.

**Project files**
- [ ] `package.json` — set `name` (the repository name), keep `version` in sync with `CHANGELOG.md`
- [ ] `src/app/layout.tsx` — replace `PROJECT_NAME` (default title and title template) and `PROJECT_DESCRIPTION` (meta description) in `metadata`
- [ ] `src/app/favicon.ico` and `src/app/opengraph-image.tsx` (link preview image) — replace with the project icon and design, see [SEO](#seo)
- [ ] `src/constants/routes.ts` — list the public pages in `PUBLIC_ROUTES` (sitemap.xml)
- [ ] `README.md` — replace `PROJECT_NAME` and every `TODO` (description, related resources, deploy steps)
- [ ] `CHANGELOG.md` — replace the `v0.0.1` placeholder line with the first task
- [ ] `.env.example` and `src/types/env.ts` — add the project's `NEXT_PUBLIC_*` variables (declare each one in both)

**Demo code**
- [ ] Replace the demo pages (`src/app`: home, `auth/login`, `private`) and `AuthLayout` with the real ones, keep `ROUTES`, `PRIVATE_ROUTES` and `PUBLIC_ROUTES` in `src/constants/routes.ts` in sync with them
- [ ] Replace the demo `logIn` in `src/lib/auth.ts` with the real login request, and make `verifySession` in `src/lib/session.ts` validate the token with the backend
- [ ] Check the cookie name in `STORAGE_KEYS.accessToken` (`src/constants/storage.ts`) matches the backend / auth flow

**GitHub**
- [ ] Create the `dev`, `staging` and `production` branches, make `dev` the default branch
- [ ] Add the secrets `SONAR_URL` and `SONAR_TOKEN` (the SonarQube project key is the repository name)
- [ ] Enable **Dependabot security updates** in the repository settings, see [Dependency updates](#dependency-updates)

**Deploy**
- [ ] Upload the env file of each environment to S3, see [Environment variables in deploy](#environment-variables-in-deploy); set `NEXT_PUBLIC_APP_URL` in each, and `NEXT_PUBLIC_APP_ENV=production` in production (only production is indexed by search engines)
- [ ] Add the staging / production release workflows and describe them in [Staging deploy](#staging-deploy) / [Production deploy](#production-deploy)
- [ ] Add the origins of third-party services (analytics, payments, widgets) to `CSP_SOURCES` in `src/lib/securityHeaders.ts`, see [Security headers](#security-headers)
- [ ] Configure `/api/*` in the hosting (CloudFront: no caching, all methods, cookies, query strings, Host header), see [Requests from Client Components](#requests-from-client-components)
- [ ] Serve HTML with `Cache-Control: no-cache` in the hosting (CloudFront, etc.), `/_next/static/*` can be cached for a year, see [Caching and deploys](#caching-and-deploys)
- [ ] Set `NEXT_PUBLIC_SENTRY_DSN` and `NEXT_PUBLIC_APP_ENV` per environment to enable Sentry, see [Sentry](#sentry)
- [ ] After the first staging deploy, check an open tab: open the app, deploy again, click a link in the old tab, it should do a full page load into the new build

## Project description
TODO add project description

## Tech stack
- [Next.js 16](https://nextjs.org/docs) (App Router, Turbopack, `output: 'standalone'`) + [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/)
- [React Compiler](https://react.dev/learn/react-compiler) — automatic memoization, no manual `useMemo` / `useCallback` / `memo` needed
- SCSS modules ([Sass](https://sass-lang.com/))
- [Vitest 5](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — tests
- [ESLint 10](https://eslint.org/) with [`@coaxsoft/eslint-config-fe-react`](https://github.com/coaxsoft/eslint-config-fe-react) — linting and formatting
- [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/) — error tracking
- [husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) — git hooks

## Pre Requirements
You will need to install these:
- Node >= 24 (see `.nvmrc`, run `nvm use`; `npm install` fails on older versions, `engine-strict` in `.npmrc`)
- npm >= 10

# Development environment
### Installation ###
- `npm install` (also installs the git hooks)
- copy env variables: `cp .env.example .env` and fill in the values
- run `npm run dev` to start the application in development mode on [http://localhost:3000](http://localhost:3000)

## Related resources
- [Production](#)
- [Staging](#)
- [API Documentation](#)
- [FrontEnd repository](#)
- [Backend repository](#)
- [Next.js documentation](https://nextjs.org/docs)
TODO other resources

## Commands

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode on port 3000. The page reloads when you make edits.

### `npm run build`
Builds the app for production into `.next`, including the self-contained server in `.next/standalone` (used by the [Docker](#docker) image).

### `npm run start`
Runs the production build locally. Next.js warns that `next start` doesn't use the standalone output, that's expected: the Docker image runs `node server.js` instead.

### `npm run lint`
Checks your code with ESLint and fixes what can be fixed automatically.

### `npm run lint:ci`
Runs ESLint and writes the report to `eslint-report.json` (used by SonarQube).

### `npm run ts:check`
Generates the Next.js route types (`next typegen`) and type-checks the project (`tsc --noEmit`) without building it.

# Test environment
### `npm test`
Runs the test suite once with Vitest.

### `npm run test:ci`
Runs the test suite with coverage. The report is written to `coverage/` (`lcov.info` is used by SonarQube).

## Git hooks
Hooks are installed by husky on `npm install`. Before every commit `.husky/pre-commit` runs `lint-staged`: `eslint --fix` on staged `js/jsx/ts/tsx` files, fixes are added to the commit. Type check and tests run in CI on every push and pull request (run them locally with `npm run ts:check` and `npm test`).

## Project structure
- `src/app` — routes (App Router): `page.tsx` per URL, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, and the SEO files (`robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, `favicon.ico`). [See file conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- `src/components` — UI components, can be composed of other components
  - `src/components/ui` — basic reusable building blocks (button, input, checkbox, page loader, `NavLink` — link with `aria-current="page"` on its page, etc.)
- `src/constants` — app-wide constants, one file per topic (`routes.ts` — URL paths and the private / public route lists, `storage.ts` — cookie and storage keys)
- `src/containers` — components that provide data and behavior (API calls, state, callbacks)
- `src/hooks` — custom React hooks
- `src/layouts` — route layouts, attached to routes by `layout.tsx` files in `src/app`
- `src/lib` — helper functions (`api.ts` / `authApi.ts` — backend API requests, see [API requests](#api-requests), `auth.ts` — login / logout Server Functions, `session.ts` — server-side auth check, `env.ts` — values from env variables with fallbacks, `sentry.ts` — Sentry setup, `reportError.ts` — error reporting for the error pages)
- `src/types` — shared TypeScript types (`env.ts` — types for `process.env`)
- `public` — static files served from `/` as they are (e.g. `/images/logo.svg`)
- `src/app/api` — Route Handlers called by Client Components: `[...path]/route.ts` forwards every request to the backend, see [Requests from Client Components](#requests-from-client-components)
- `src/proxy.ts` — runs before every route, protects the private routes, see [Routing](#routing)
- `src/instrumentation.ts`, `src/instrumentation-client.ts` — Sentry setup, see [Sentry](#sentry)
- `src/__tests__` — tests and test utils:
  - `_utils/render.tsx` — Testing Library `render` with the app providers, re-exports everything else and `userEvent` for interactions
  - `_utils/navigation.ts` — `next/navigation` mocks (`useRouter`, `usePathname`, `useSearchParams`, `useParams`), registered for every test in `setup.ts`; `mockRouter.push` etc. to check navigation, `setNavigation({ pathname, searchParams, params })` to set the current URL

`src/pages` is reserved by Next.js for the Pages Router, don't create it. Import from `src` with the `@/` alias, e.g. `import { ROUTES } from '@/constants/routes';`.

### Routing
- `src/constants/routes.ts` — `ROUTES` URL constants. Use them everywhere instead of string paths: `<Link href={ROUTES.login}>`, `router.push(ROUTES.home)`, `redirect(ROUTES.login)`. `typedRoutes` in `next.config.ts` makes a link to a route that doesn't exist a type error.
- `src/app` — one folder per URL (`src/app/auth/login/page.tsx` is `ROUTES.login`). `src/app/auth/layout.tsx` renders every `/auth` route inside `AuthLayout`. Unknown URLs render `not-found.tsx`, rendering errors render `error.tsx` (`global-error.tsx` for errors in the root layout).
- `src/proxy.ts` — auth, first step: runs on the server before a route is rendered (page loads and client-side navigations). Routes in `PRIVATE_ROUTES` (`src/constants/routes.ts`, nested paths included) redirect to `ROUTES.login` without the `STORAGE_KEYS.accessToken` cookie. It only checks that the cookie exists, the backend still validates the token. `config.matcher` must be a literal, it skips static files.
- `src/lib/session.ts` — auth, the real check: `verifySession()` reads the access token on the server and redirects to login without it. Call it in every private page and Server Function that reads or changes private data (not in a layout: layouts don't render again on client-side navigation). Route Handlers use `getAccessToken()` and answer `401` instead: the browser's `fetch` would follow a redirect and get the login page HTML with status 200. It runs once per request (`cache`), and `server-only` makes importing it from a Client Component a build error. Next.js recommends this [Data Access Layer](https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal) because the proxy check is only optimistic.
- `src/lib/auth.ts` — `logIn` / `logOut` Server Functions used as form actions: they set / delete the access token cookie on the server (`httpOnly`, `secure`, `sameSite: 'lax'`), so browser JavaScript can't read the token, then redirect.

To add a page: add its path to `ROUTES`, create `src/app/<path>/page.tsx`. If it needs login: add it to `PRIVATE_ROUTES` (the proxy redirects it to login, robots.txt hides it) and call `await verifySession()` in the page. If it is public: add it to `PUBLIC_ROUTES` (sitemap.xml). Both lists are in `src/constants/routes.ts`.

### API requests
`src/lib/api.ts` — `apiFetch`, a `fetch` wrapper for the backend (`NEXT_PUBLIC_API_URL`), on the server and in the browser:
```ts
const users = await apiFetch<Array<User>>('/users', { query: { page: 1 } });
await apiFetch('/users', { method: 'POST', body: { name } }); // objects are sent as JSON
```
- The path is added to `NEXT_PUBLIC_API_URL` (a base path like `/v1` is kept), `query` becomes the query string.
- JSON responses are parsed, text is returned as it is, `204` / an empty body returns `null`. The type parameter is not checked at runtime, validate the data (e.g. with `zod`) where it matters.
- A response that isn't 2xx throws `ApiError` with `status` and the parsed body in `data` (e.g. validation errors). Error pages don't report 4xx `ApiError`s to Sentry.
- Requests time out after 30 seconds (`timeoutMs`). A `signal` you pass (e.g. from TanStack Query) cancels the request earlier, the timeout still applies.
- Other `fetch` options pass through, including Next.js caching for public data: `next: { revalidate: 60 }`. Never cache a request with an access token, the response would be shared between users.

`src/lib/authApi.ts` — `authApiFetch`, the same with the access token of the current user (`verifySession()`), for Server Components and Server Functions. A `401` from the backend redirects to login. In a Route Handler use `getAccessToken()` from `src/lib/session.ts` and `apiFetch(path, { accessToken })`, and answer `401` without a token (see `src/app/api/[...path]/route.ts`). It is `server-only`: the token cookie is `httpOnly`, so Client Components get private data through a Server Component or a Server Function, not by calling the API directly.
```ts
const user = await authApiFetch<User>('/me');
```

### Requests from Client Components
The access token is in an `httpOnly` cookie: browser JavaScript can't read it, so it can't call the backend with it directly. Choose by what the request does:

| Case | How | Example |
|---|---|---|
| Show data | fetch in the Server Component (`authApiFetch`), pass it to Client Components as props | `src/app/private/page.tsx` |
| The user picks which data (pagination, filters) and it may be in the URL | put it in the URL (`<Link href="?page=2">`, `router.replace`), the Server Component reads `searchParams` and renders again (only the page, no full page load) | — |
| Change data (forms, buttons) | Server Function (`'use server'`), Next.js checks the origin; `refresh()` renders the page again with the new data | `src/lib/auth.ts` |
| Filters that can't be in the URL (sensitive values, too much state), "load more", polling | the Client Component keeps the state and calls the backend through the API proxy with `appApiFetch` | — |

**API proxy** — `src/app/api/[...path]/route.ts` forwards every request from the browser to the backend, so a new backend endpoint needs no new file:
```ts
// in a Client Component: /api/notifications?page=3 → NEXT_PUBLIC_API_URL/notifications?page=3
const notifications = await appApiFetch<Array<Notification>>('/notifications', { query: { page: 3 } });
await appApiFetch(`/notifications/${id}/read`, { method: 'POST' });
```
- Adds `Authorization: Bearer <token>` from the `httpOnly` cookie, answers `401` without a session (catch the `ApiError` and send the user to login).
- Forwards only the method, path, query, body (streamed, so file uploads work) and the `Accept` / `Content-Type` / conditional headers, never the browser's cookies.
- Passes the backend's status, body (streamed, so downloads work) and `Content-Type` / `Content-Disposition` / `ETag` back, with `Cache-Control: private, no-store`. 4xx with validation errors arrive as they are, as `ApiError.data`.
- Rejects `POST` / `PUT` / `PATCH` / `DELETE` from other sites (`Origin` check, `src/lib/request.ts`) and paths with `..`.
- Cancels the backend request when the browser cancels (e.g. a newer search) and after 30 seconds; an unreachable backend answers `500` and is reported to Sentry.
- Also forwards `X-Forwarded-For` and `User-Agent`, so backend logs and rate limits see the user's IP and browser, not the Next.js server. A client can send its own `X-Forwarded-For`, so the backend must trust only the address the load balancer adds (the last one), not the first.
- The backend still validates the input and checks the permissions: through the proxy, a user can do exactly what their token allows.
- File downloads: `appApiFetch` reads responses as JSON or text, so link to the file instead: `<a href="/api/reports/1/pdf" download>` (the browser sends the cookie).

A Route Handler for a specific path (e.g. `src/app/api/dashboard/route.ts`) takes precedence over the proxy. Write one only when the request needs more than forwarding: combine several backend calls, reshape or hide data, use a server-only secret.

Every request from the browser goes browser → Next.js server → backend. For a page with many requests, a data library (TanStack Query, SWR) adds caching, request deduplication and cancelling of outdated requests on top of `appApiFetch` (`queryFn: ({ signal }) => appApiFetch(path, { signal })`).

Hosting: `/api/*` responses are per user. In CloudFront, `/api/*` needs its own behavior: caching disabled, all HTTP methods allowed, cookies (`accessToken`) and query strings forwarded, and the `Host` header forwarded (the `Origin` check compares it with the browser's `Origin`; the same applies to Server Functions).

### Security headers
`src/lib/securityHeaders.ts`, added to every response in `next.config.ts` `headers()`:
- `Content-Security-Policy` — scripts, styles, images, fonts, connections and frames only from this site; no plugins, no `<base>` hijacking, forms only to this site, the site can't be embedded (`frame-ancestors 'none'`). `upgrade-insecure-requests` only when `NEXT_PUBLIC_APP_URL` is https, `'unsafe-eval'` only in `next dev` (React needs it there).
- `Strict-Transport-Security` (only for an https site), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation off), `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin-allow-popups` (keeps OAuth login popups working).

The policy is static (the same for every page), so pages stay prerendered and cacheable. It has to allow `'unsafe-inline'` scripts, because Next.js adds inline scripts to every page. A [nonce-based policy](https://nextjs.org/docs/app/guides/content-security-policy) also blocks injected inline scripts, but every page is then rendered per request: use it only when the project's security requirements need it.

- **Third-party services**: add their origins to `CSP_SOURCES` (e.g. Stripe: `script` and `frame` `https://js.stripe.com`, `connect` `https://api.stripe.com`). A blocked resource shows up as a CSP error in the browser console.
- **Rolling out changes**: to try a stricter policy without breaking anything, send it as `Content-Security-Policy-Report-Only` first (the browser only reports violations in the console), then switch back to `Content-Security-Policy`.
- **Backend and Sentry need no entries**: the browser calls the backend through the API proxy (`/api`), and Sentry through its tunnel route (`tunnelRoute` in `next.config.ts`), both on this site.

### Caching and deploys
Every build gets new hashed file names in `/_next/static/`, the old ones are not in the new image.
- Next.js handles a tab opened before a deploy: when a client-side navigation requests the new page from the server, it sees that the server runs another build and does a full page load instead. No custom reload code is needed for this.
- Old files can still be requested without asking the server first: a navigation to a page prefetched before the deploy (static pages reuse the prefetch for up to 5 minutes), or code loaded lazily (`next/dynamic`, `import()`). If the file is gone, the user sees `error.tsx`. Keeping the previous build's `/_next/static/*` files reachable for a while after a deploy (e.g. in the CDN cache) avoids it.
- [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) is not set: it is for rolling deploys where old and new servers run at the same time and the hosting routes requests by deployment.

Headers in the hosting (CloudFront, etc.):
- HTML must be served with `Cache-Control: no-cache`. Next.js sends `s-maxage=31536000` for pages prerendered at build time, so the hosting must override it (or invalidate the HTML on every deploy), otherwise users get the old HTML after a deploy.
- `/_next/static/*` — Next.js sends `public, max-age=31536000, immutable` (hashed file names), keep it.

### SEO
Built with the Next.js [Metadata API and file conventions](https://nextjs.org/docs/app/getting-started/metadata-and-og-images):
- `src/app/layout.tsx` `metadata` — defaults for every page: title template (`LogIn | PROJECT_NAME`), description, Open Graph / Twitter card, `metadataBase` (`NEXT_PUBLIC_APP_URL`) for absolute URLs. A page overrides fields with its own `metadata` export.
- `src/app/robots.ts` — `/robots.txt`. Only `NEXT_PUBLIC_APP_ENV=production` allows indexing (except `PRIVATE_ROUTES`), any other environment (staging, a build without the variable) blocks everything.
- `src/app/sitemap.ts` — `/sitemap.xml` with the pages in `PUBLIC_ROUTES` (`src/constants/routes.ts`).
- `src/app/opengraph-image.tsx` — preview image (1200x630) for shared links, generated at build time. Replace it with the project design or a static `opengraph-image.png`.
- `src/app/favicon.ico` — the favicon. Add `icon.png` / `apple-icon.png` next to it for other sizes.
- Private pages set `robots: { index: false }` in their `metadata`.

robots.txt, sitemap.xml and the preview image are generated at build time, so `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_APP_ENV` must be in the env file of each environment.

## Settings

#### `next.config.ts`
Configuration for Next.js: standalone output, React Compiler (for the app build, not in tests), typed routes, security headers, wrapped with `withSentryConfig` (Sentry tunnel route). [See configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js)

#### `eslint.config.js`
ESLint flat config, based on `@coaxsoft/eslint-config-fe-react/next` plus project overrides and Vitest rules for test files. [See configuration](https://eslint.org/docs/latest/use/configure/)

#### `vitest.config.ts`
Configuration for Vitest (Next.js has no Vite config): jsdom, `@/` alias from `tsconfig.json` `paths`, coverage; mock calls, `vi.spyOn` spies and `vi.stubEnv` values are reset before each test. React Compiler is not used in tests, its generated branches would distort coverage. [See configuration](https://vitest.dev/config/)

#### `tsconfig.json`
TypeScript configuration, managed together with Next.js (`next build` / `next typegen` add the options Next.js needs). `target`/`lib` ES2023 to match the browsers Next.js supports. TypeScript only type-checks (`noEmit`), Next.js compiles. [See configuration](https://nextjs.org/docs/app/api-reference/config/typescript)

#### `package.json` `"type": "module"`
`.js` files are ES modules (`import` / `export`), like the configs and the generated standalone `server.js`. A tool config that has to be CommonJS (`module.exports`) needs the `.cjs` extension.

#### `package.json` `overrides`
`fast-glob` in `@next/eslint-plugin-next` is replaced by `tinyglobby` (same `globSync` API), the pinned `fast-glob@3.3.1` depends on a vulnerable `braces`. Remove the override once `@next/eslint-plugin-next` updates it.

#### `.env.example`, `src/types/env.ts`
Environment variables template. `NEXT_PUBLIC_*` variables are embedded into the JavaScript at build time and are public. Declare each one in `NodeJS.ProcessEnv` in `src/types/env.ts` to get it typed.

#### `.nvmrc`, `.npmrc`
Node version for nvm and CI. `engine-strict` makes `npm install` fail on a Node version outside `engines` in `package.json`.

#### `AGENTS.md`
Instructions for AI coding agents, written by `next dev`: use the docs of the installed Next.js version in `node_modules/next/dist/docs`. `next dev` recreates the block if it is removed, commit it. Project rules for agents can be added outside the `nextjs-agent-rules` block.

#### `.editorconfig`
Basic formatting (2 spaces, LF line endings, UTF-8, final newline) applied by the editor to every file, including files ESLint doesn't check (JSON, YAML, Markdown, SCSS). Supported by VS Code (EditorConfig extension) and JetBrains IDEs.

#### `src/__tests__/setup.ts`
Test setup, adds the `@testing-library/jest-dom` matchers and the `next/navigation` mocks.

#### `.husky/`
Git hooks, see [Git hooks](#git-hooks).

#### `.github/dependabot.yml`
Weekly dependency update pull requests, see [Dependency updates](#dependency-updates).

#### `Dockerfile`, `.dockerignore`
Production image, see [Docker](#docker).

# Deployment instructions

### Sentry
Error tracking is enabled only when `NEXT_PUBLIC_SENTRY_DSN` is set, so local development and tests send nothing.
- `src/lib/sentry.ts` — `initSentry()`, called for the browser (`src/instrumentation-client.ts`), the Node.js server (`sentry.server.config.ts`) and the edge runtime (`sentry.edge.config.ts`), the last two are loaded from `src/instrumentation.ts`.
- `src/instrumentation.ts` — `onRequestError` reports server errors (Server Components, route handlers, Server Functions, proxy).
- `src/app/error.tsx`, `src/app/global-error.tsx` — report rendering errors through `src/lib/reportError.ts` (error boundaries catch them, so they don't reach Sentry on their own). Errors with a 4xx `status` (e.g. a 404 from the API) are expected app states and are not reported, also when they are thrown on the server (`beforeSend` in `src/lib/sentry.ts`); `notFound()` and `redirect()` never reach the error pages. Errors with a `digest` come from the server and are already reported by `onRequestError`, so they are not reported twice.

Browser events go to Sentry through a route on this site (`tunnelRoute: true` in `next.config.ts`, a random path per build), so the CSP needs no Sentry domain and ad blockers don't drop them.

Set `NEXT_PUBLIC_SENTRY_DSN` (project DSN) at build time. Events are tagged with `NEXT_PUBLIC_APP_ENV` (e.g. `staging`, defaults to `NODE_ENV`). Source maps are not uploaded (`sourcemaps.disable` in `next.config.ts`), so no Sentry auth token is needed.

### Docker
`Dockerfile` is a multi-stage build on Node 24: dependencies, the build (`next build` with the standalone output), then only the standalone server, `.next/static` and `public` run as the non-root `node` user on port 3000 (`node server.js`). The npm cache and the Next.js build cache (`.next/cache`) are kept between builds with BuildKit cache mounts:
```bash
docker build -t PROJECT_NAME .
docker run -p 3000:3000 PROJECT_NAME
```

The build reads `NEXT_PUBLIC_*` values from `.env` in the project folder: `.dockerignore` lets `.env` in (other `.env.*` files are excluded), and the build stage deletes it from the standalone output, so it is not in the final image. Without `.env` the image is built with empty values (Sentry is off).

### Environment variables in deploy
`NEXT_PUBLIC_*` variables are embedded into the JavaScript when `next build` runs inside `docker build`. The env file of each environment is stored in S3, the release workflow downloads it as `.env` before building the image (no build args). Example steps:
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v6
  with:
    aws-region: AWS_REGION
    role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github/GitHubRole

- name: Copy .env file from S3 bucket
  run: aws s3 cp s3://PROJECT_NAME-stg-env-files/PROJECT_NAME-stg-fe.env .env

- name: Build, tag, and push image to Amazon ECR
  uses: docker/build-push-action@v7
  with:
    context: .
    push: true
    tags: ECR_REGISTRY/PROJECT_NAME-stg-fe:latest
```

Server-only variables (without `NEXT_PUBLIC_`) are read at runtime, set them on the container (e.g. `env_file` in docker-compose).

### CI
GitHub workflows in `.github/workflows` run lint, type check, tests, build and the SonarQube scan on pushes to `dev`, `staging`, `production` (`ci-branch.yml`) and on every pull request (`ci-pull-request.yml`). The CI build runs without `.env` and reuses the Next.js build cache (`.next/cache`) between runs. SonarQube settings are passed in the workflow files (secrets: `SONAR_URL`, `SONAR_TOKEN`). `labeler.yml` adds the `changelog_unchanged` label to pull requests that don't update `CHANGELOG.md`.

### Dependency updates
[Dependabot](https://docs.github.com/en/code-security/dependabot) (`.github/dependabot.yml`) opens pull requests against `dev` every week:
- npm: minor and patch updates together in one pull request, every major update in its own. A version is proposed only after it has been published for 7 days (`cooldown`), so broken or malicious releases are usually gone by then.
- GitHub Actions: all updates in one pull request.
- Ignored: `@types/node` majors (they follow the Node.js version in `.nvmrc`).

Each pull request runs CI like any other, merge it when it's green. Node.js itself (`.nvmrc`, `engines`, `Dockerfile` `node:24-alpine`) is updated by hand, all three together. Security updates come as separate pull requests once **Dependabot security updates** are enabled in the repository settings.

### Staging deploy
TODO describe how to deploy to staging

### Production deploy
TODO describe how to deploy to production
