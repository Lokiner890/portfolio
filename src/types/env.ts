// Types for process.env: declare every variable from .env.example here.
// NEXT_PUBLIC_* values are embedded at build time, see .env.example.
declare global {
  // NodeJS.ProcessEnv can only be extended through its namespace
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      // backend API, required: requests fail with a clear error without it
      readonly NEXT_PUBLIC_API_URL: string;
      // public URL of the app, defaults to http://localhost:3000
      readonly NEXT_PUBLIC_APP_URL?: string;
      // deployment environment, defaults to NODE_ENV (`development` / `production`)
      readonly NEXT_PUBLIC_APP_ENV?: string;
      // Sentry is disabled when the DSN is empty
      readonly NEXT_PUBLIC_SENTRY_DSN?: string;
    }
  }
}

export {};
