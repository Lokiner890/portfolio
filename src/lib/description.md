# lib

Non-UI code used across the app, one file per topic: helper functions, SDK setup, server-side data access, Server Functions.

Files with `'use server'` at the top contain Server Functions: they run only on the server and can be passed to forms (`<form action={logIn}>`) or called from Client Components. Every Server Function is a public endpoint, check the session (`verifySession()`) and validate the input inside it.

Files with `import 'server-only'` (e.g. `session.ts`) can only be imported on the server, importing them from a Client Component is a build error.

example `auth.ts` (login / logout Server Functions), `session.ts` (server-side auth check), `env.ts` (env values with fallbacks), `sentry.ts`, `reportError.ts`, `formatDate.ts`, etc.
