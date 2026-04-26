/**
 * クライアント露出が許される環境変数の集約モジュール。
 * サーバ専用シークレットはここに置かない。
 */

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

const rawBuildId = process.env.BUILD_ID;

if (typeof window === 'undefined' && isProduction && !rawBuildId) {
  console.warn('[config/environment] BUILD_ID is not set in production; OGP cache-busting will be disabled.');
}

export const buildId = rawBuildId ?? '';

/** 環境変数 IS_DEVELOPMENT に対応するビルド時フラグ。未来日付の記事を出力に含める。 */
export const isContentPreview = Boolean(process.env.IS_DEVELOPMENT);
