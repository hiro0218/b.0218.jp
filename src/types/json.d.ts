/**
 * JSON ファイルのグローバル型定義
 * プロジェクトルートに配置してTypeScriptのモジュール解決を支援
 */

/**
 * 検索用データの型定義
 */
interface SearchDataItem {
  slug: string;
  title: string;
  tags: string[];
  tokens: string[];
}

/**
 * 転置インデックスの型定義
 */
type SearchIndex = Record<string, string[]>;

/**
 * 検索サジェスト候補の型定義
 */
type SearchSuggestions = string[];

/**
 * dist配下のJSONファイルに対する型定義
 * ~ エイリアスを使用したimportに対応
 */
declare module '~/dist/search-data.json' {
  const data: SearchDataItem[];
  export default data;
}

declare module '~/dist/search-index.json' {
  const index: SearchIndex;
  export default index;
}

declare module '~/dist/search-suggestions.json' {
  const suggestions: SearchSuggestions;
  export default suggestions;
}

// その他のdist配下のJSONファイル
declare module '~/dist/*.json' {
  const value: unknown;
  export default value;
}
