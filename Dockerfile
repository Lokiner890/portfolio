# deps stage: install dependencies, cached until package.json / package-lock.json change
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./

# skip git hooks install, there is no .git in the image
ENV HUSKY=0
# the npm cache is kept between image builds (BuildKit cache mount), it is not part of the image
RUN --mount=type=cache,target=/root/.npm npm ci

# build stage: build the app with the standalone output (next.config.ts `output: 'standalone'`).
# NEXT_PUBLIC_* values are embedded here from `.env`: the release workflow downloads it from S3
# before `docker build`, no build args. See "Environment variables in deploy" in README.md.
FROM node:24-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# the standalone output copies .env, remove it so the values used for the build don't end up in the image;
# server-only variables (without NEXT_PUBLIC_) are set on the container at runtime
# .next/cache is kept between image builds (BuildKit cache mount), so unchanged code isn't compiled again
RUN --mount=type=cache,target=/app/.next/cache npm run build && rm -f .next/standalone/.env*

# run stage: only the standalone server, static files and public folder, no source code or dev dependencies
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# listen on all interfaces, not only on the container hostname
ENV HOSTNAME=0.0.0.0

# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

# the official node image has a non-root `node` user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
