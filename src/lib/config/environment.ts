/**
 * Public-safe environment constants. Do not place server-only secrets here.
 */

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

const rawBuildId = process.env.BUILD_ID;

if (typeof window === 'undefined' && isProduction && !rawBuildId) {
  throw new Error('[config/environment] BUILD_ID is required in production but was not set.');
}

export const buildId = rawBuildId ?? '';

/** Build-time flag (IS_DEVELOPMENT env): include future-dated posts in the output. */
export const isContentPreview = Boolean(process.env.IS_DEVELOPMENT);
