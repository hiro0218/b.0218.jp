/**
 * localStorage 専用の型安全なユーティリティ
 *
 * Safari プライベートモードなどストレージアクセス拒否環境ではすべての関数が false/null を返す
 * QuotaExceededError（容量超過）に対する自動リトライ機能を提供
 */

/**
 * localStorageから値を取得してパース
 * @param key ストレージキー
 * @returns 失敗時・サーバーサイド・ストレージアクセス拒否時はnull
 * @example
 * const data = getLocalStorage<MyData>('key');
 * if (data === null) {
 *   return defaultData;
 * }
 */
export const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item from localStorage (${key}):`, error);
    return null;
  }

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to parse JSON from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * localStorageに値を保存
 * QuotaExceededError発生時は onQuotaExceeded コールバックを実行
 *
 * @param key ストレージキー
 * @param value 保存する値
 * @param options.onQuotaExceeded 容量超過時のコールバック（古いキャッシュ削除など）
 * @returns サーバーサイド・ストレージアクセス拒否時・保存失敗時はfalse
 * @example
 * const success = setLocalStorage('key', data, {
 *   onQuotaExceeded: () => clearOldCache('cache-key-pattern')
 * });
 * if (!success) {
 *   console.warn('Storage unavailable, using memory cache');
 * }
 */
export const setLocalStorage = <T>(
  key: string,
  value: T,
  options?: {
    onQuotaExceeded?: () => void;
  },
): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch (error) {
    console.error(`Failed to stringify value for localStorage (${key}):`, error);
    return false;
  }

  try {
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // QuotaExceededError のハンドリング
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn(`localStorage quota exceeded for key: ${key}`);
      options?.onQuotaExceeded?.();
      return false;
    }

    console.error(`Failed to set item to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * localStorageから値を削除
 * @param key ストレージキー
 * @returns サーバーサイド・ストレージアクセス拒否時はfalse
 * @example
 * if (!removeLocalStorage('key')) {
 *   console.info('Storage clear skipped');
 * }
 */
export const removeLocalStorage = (key: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * 指定パターンに一致するlocalStorageキーを削除
 * ビルドID更新時の古いキャッシュクリアなどに使用
 *
 * @param pattern キーに含まれる文字列パターン（省略時は全キーをチェック）
 * @param excludeKey 削除から除外するキー
 * @example
 * // ビルドID が変わった際に古いキャッシュをクリア
 * clearOldCache('posts-list', 'v2.0.0_posts-list');
 *
 * @example
 * // 特定プレフィックスのキャッシュをすべてクリア
 * clearOldCache('cache-');
 */
export const clearOldCache = (pattern?: string, excludeKey?: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // localStorage.key() と localStorage.length を使用してキーを取得
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }

    // キーのリストをイテレート（削除中に length が変わるため事前に収集）
    keys.forEach((key) => {
      // 除外キーはスキップ
      if (key === excludeKey) {
        return;
      }

      // パターン指定がない場合は全キー、ある場合はパターンに一致するキーのみ削除
      const shouldRemove = !pattern || key.includes(pattern);

      if (shouldRemove) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear old cache:', error);
  }
};
