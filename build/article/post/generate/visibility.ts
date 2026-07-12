import type { RawPost } from './raw';

export type VisibilityContext = {
  now: Date;
  isContentPreview: boolean;
};

/**
 * このビルドで記事を公開すべき場合に true を返す。
 * preview モードでない限り、未来日付の記事は非公開扱い。
 */
export function isPubliclyVisible(raw: RawPost, ctx: VisibilityContext): boolean {
  if (ctx.isContentPreview) return true;
  return new Date(raw.date) <= ctx.now;
}
