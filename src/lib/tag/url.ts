/** URL-safe path segment derived from a Tag display name. */
export function tagUrlPath(name: string): string {
  return encodeURIComponent(name);
}

/** Tag display name extracted from a URL path segment. */
export function tagFromUrlPath(segment: string): string {
  return decodeURIComponent(segment);
}
