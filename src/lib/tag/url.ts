/** タグ表示名を URL パスセグメントに変換する。 */
export function tagUrlPath(name: string): string {
  return encodeURIComponent(name);
}

/**
 * URL パスセグメントからタグ表示名を取り出す。
 * decodeURIComponent は不正な % エスケープ（例: "100%"）で URIError を投げるが、
 * generateMetadata と Route Handler の params は、generateStaticParams が返した
 * 未エンコードの表示名のまま届くため、SSG が落ちないよう失敗時は元のセグメントを返す。
 */
export function tagFromUrlPath(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
