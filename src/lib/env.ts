// Values derived from the env variables (see .env.example), with their fallbacks.
// `||`, not `??`: an empty value copied from .env.example (`NEXT_PUBLIC_APP_URL=`) must also fall back.

// deployment environment, e.g. staging; defaults to NODE_ENV (development / production)
export const getAppEnv = () => process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;

// public URL of the app, used for absolute URLs in metadata, robots.txt and sitemap.xml
export const getAppUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// only production is indexed by search engines, NEXT_PUBLIC_APP_ENV must be set to `production` there
export const isIndexable = () => process.env.NEXT_PUBLIC_APP_ENV === 'production';
