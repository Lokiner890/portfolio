# layouts

Layouts are components that wrap a group of routes with shared UI (header, sidebar, auth card, etc.). A layout renders its `children` where the matched page should appear.

Layouts are attached to routes by a `layout.tsx` file in `src/app`, e.g. `src/app/auth/layout.tsx` renders `AuthLayout` for every route under `/auth`.

example AuthLayout, DashboardLayout, etc.
