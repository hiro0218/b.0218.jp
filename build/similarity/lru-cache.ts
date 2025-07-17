/**
 * LRU (Least Recently Used) キャッシュの実装
 *
 * メモリ使用効率を向上させるため、最大サイズを持つLRUキャッシュを提供する。
 * 最も長く使用されていないアイテムが最大サイズに達した時に自動的に削除される。
 *
 * @template K キーの型
 * @template V 値の型
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;
  private keyUsage: Map<K, number>; // キーと最後に使用されたタイムスタンプのマップ

  /**
   * LRUキャッシュを初期化
   * @param capacity キャッシュの最大サイズ
   */
  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.cache = new Map<K, V>();
    this.keyUsage = new Map<K, number>();
  }

  /**
   * キャッシュから値を取得
   * キーが存在する場合、そのキーの使用タイムスタンプを更新
   *
   * @param key 取得するキー
   * @returns キーに対応する値、存在しない場合は undefined
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // 値を取得し、使用タイムスタンプを更新
    const value = this.cache.get(key)!;
    this.keyUsage.set(key, Date.now());
    return value;
  }

  /**
   * キャッシュに値を設定
   * キャッシュがいっぱいの場合、最も長く使用されていないアイテムを削除
   *
   * @param key 設定するキー
   * @param value 設定する値
   */
  set(key: K, value: V): void {
    // キャッシュが容量に達していて、かつ新しいキーを追加する場合
    if (this.cache.size >= this.capacity && !this.cache.has(key)) {
      // 最も古いキーを見つけて削除
      const oldestKey = this.findOldestKey();
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
        this.keyUsage.delete(oldestKey);
      }
    }

    // 新しい値を設定し、現在のタイムスタンプを記録
    this.cache.set(key, value);
    this.keyUsage.set(key, Date.now());
  }

  /**
   * キャッシュから指定されたキーを削除
   *
   * @param key 削除するキー
   * @returns 削除が成功したかどうか
   */
  delete(key: K): boolean {
    const deleted = this.cache.delete(key);
    this.keyUsage.delete(key);
    return deleted;
  }

  /**
   * キャッシュ内のすべてのアイテムを削除
   */
  clear(): void {
    this.cache.clear();
    this.keyUsage.clear();
  }

  /**
   * キャッシュに特定のキーが存在するかどうかを確認
   *
   * @param key 確認するキー
   * @returns キーが存在するかどうか
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * 現在のキャッシュサイズを取得
   *
   * @returns キャッシュ内のアイテム数
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 最も長く使用されていないキーを見つける
   *
   * @returns 最も古いキー、またはキャッシュが空の場合は undefined
   */
  private findOldestKey(): K | undefined {
    if (this.keyUsage.size === 0) {
      return undefined;
    }

    let oldestKey: K | undefined;
    let oldestTime = Infinity;

    for (const [key, timestamp] of this.keyUsage.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}
