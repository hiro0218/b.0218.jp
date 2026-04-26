import type { RawPost } from './raw';

export type VisibilityContext = {
  now: Date;
  isContentPreview: boolean;
};

/**
 * Returns true if a post should be exposed in this build. Future-dated posts
 * are hidden unless preview mode is enabled.
 */
export function isPubliclyVisible(raw: RawPost, ctx: VisibilityContext): boolean {
  if (ctx.isContentPreview) return true;
  return new Date(raw.date) <= ctx.now;
}
