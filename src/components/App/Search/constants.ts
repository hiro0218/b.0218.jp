export const SEARCH_LABELS = {
  searchTitle: '記事検索',
  searchDescription: '記事のタイトルから検索することができます',
  searchPlaceholder: '記事タイトルまたはタグを検索',
  searchResults: '検索結果',
  siteSearch: 'サイト内検索',
} as const;

/**
 * 検索結果リストコンテナの DOM 契約。
 * JSX 側の属性付与（SearchResultList）とセレクタ参照（useSearchDOMRefs / useSearchNavigation）が
 * この定数の対で結ばれており、片方だけ変えるとキーボードナビとスクロール制御が沈黙して壊れる。
 */
export const SEARCH_RESULTS_ATTRIBUTE = 'data-search-results';
export const SEARCH_RESULTS_SELECTOR = `[${SEARCH_RESULTS_ATTRIBUTE}]`;

/** SEARCH_RESULTS_SELECTOR と対になる属性。JSX へは常にこれを spread して付与し、複数箇所での再定義によるドリフトを防ぐ */
export const SEARCH_RESULTS_MARKER_PROPS = { [SEARCH_RESULTS_ATTRIBUTE]: '' };

/**
 * 検索入力欄と判定する契約セレクタ。SearchHeader の input（type="search" + role="combobox"）が満たす。
 * useSearchDOMRefs の入力欄取得と useSearchNavigation のキーイベント判定で共有する。
 */
export const SEARCH_INPUT_SELECTOR = 'input[type="search"], input[role="searchbox"], input[role="combobox"]';

/** 検索クエリの空白分割契約。エンジンのトークン分割とハイライターのキーワード分割で共有する（乖離するとマッチしたのにハイライトされない） */
export const QUERY_WHITESPACE_REGEX = /\s+/;
