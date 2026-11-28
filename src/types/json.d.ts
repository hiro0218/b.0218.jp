import type { SearchDataPayload } from '@/lib/search';

/**
 * JSON ファイルの型定義
 * プロジェクトルートに配置してTypeScriptのモジュール解決を支援
 */

/**
 * dist配下のJSONファイルに対する型定義
 * ~ エイリアスを使用したimportに対応
 */
declare module '~/dist/search.json' {
  const data: SearchDataPayload;
  export default data;
}

// その他のdist配下のJSONファイル
declare module '~/dist/*.json' {
  const value: unknown;
  export default value;
}
