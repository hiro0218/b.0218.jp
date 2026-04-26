/** タグ表示名の同一性比較に使う正規化キー（canonical form）を返す。 */
export function tagKey(name: string): string {
  return name.toLowerCase();
}

/** 2 つのタグ表示名が正規化キー上で等しいかを判定する。 */
export function tagsEqual(a: string, b: string): boolean {
  return tagKey(a) === tagKey(b);
}
