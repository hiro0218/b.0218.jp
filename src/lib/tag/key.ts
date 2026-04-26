/** Equality key for a Tag display name (canonical form). */
export function tagKey(name: string): string {
  return name.toLowerCase();
}

/** Tag display names compare equal under their equality key. */
export function tagsEqual(a: string, b: string): boolean {
  return tagKey(a) === tagKey(b);
}
