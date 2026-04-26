import matter from 'gray-matter';

/**
 * Frontmatter shape after gray-matter parses a markdown file.
 * `date` and `updated` may be either an ISO string or a parsed Date depending on YAML.
 */
export type RawPostFrontmatter = {
  title: string;
  date: string | Date;
  updated?: string | Date;
  note?: string;
  tags?: string[];
  noindex?: boolean;
};

/**
 * Validated, slug-bound, ISO-dated input for the markdown -> Post conversion.
 * `content` is the raw markdown body; HTML conversion has not happened yet.
 */
export type RawPost = {
  slug: string;
  content: string;
  title: string;
  date: string;
  updated?: string;
  note?: string;
  tags: string[];
  noindex?: boolean;
};

/** Parse a markdown source into frontmatter (unvalidated) and body. */
export function parseFrontmatter(source: string): { frontmatter: unknown; markdown: string } {
  const result = matter(source);
  return { frontmatter: result.data, markdown: result.content };
}

/** Type guard: required and optional frontmatter fields are well-typed. */
export function isValidFrontmatter(value: unknown): value is RawPostFrontmatter {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== 'string' || !v.title.trim()) return false;
  if (typeof v.date !== 'string' && !(v.date instanceof Date)) return false;
  if (v.updated !== undefined && typeof v.updated !== 'string' && !(v.updated instanceof Date)) return false;
  if (v.note !== undefined && typeof v.note !== 'string') return false;
  if (v.tags !== undefined && !Array.isArray(v.tags)) return false;
  if (v.noindex !== undefined && typeof v.noindex !== 'boolean') return false;
  return true;
}
