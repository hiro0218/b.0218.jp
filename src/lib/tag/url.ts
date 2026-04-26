/** URL-safe path segment derived from a Tag display name. */
export function tagUrlPath(name: string): string {
  return encodeURIComponent(name);
}

/**
 * Tag display name extracted from a URL path segment.
 * decodeURIComponent throws URIError on malformed escapes (e.g. "100%"),
 * but TagCounts.slug is the display name itself and may not be encoded;
 * fall back to the raw segment so SSG and page rendering do not crash.
 */
export function tagFromUrlPath(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
