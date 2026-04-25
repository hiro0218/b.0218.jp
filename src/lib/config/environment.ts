/**
 * Application environment constants.
 *
 * Place only public-safe values here. For server-only secrets,
 * create a separate `src/lib/config/server-only.ts` module.
 */

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

const rawBuildId = process.env.BUILD_ID;

if (typeof window === 'undefined' && isProduction && !rawBuildId) {
  throw new Error('[config/environment] BUILD_ID is required in production but was not set.');
}

export const buildId = rawBuildId ?? '';
