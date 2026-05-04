import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { RawPost } from '@/lib/post/raw';
import type { Post } from '@/types/source';
import type { LinkPreviewCache } from '../../rehype0218';

type CacheEntry = {
  key: string;
  post: Post;
};

type PostConversionCache = {
  entries: Record<string, CacheEntry>;
  version: string;
};

const CACHE_SCHEMA_VERSION = 'post-conversion-v1';
const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'post-conversion.json');

const PIPELINE_SOURCE_PATHS = [
  path.join(process.cwd(), 'build', 'article'),
  path.join(process.cwd(), 'src', 'lib', 'post', 'convert.ts'),
  path.join(process.cwd(), 'src', 'constants.ts'),
  path.join(process.cwd(), 'package.json'),
  path.join(process.cwd(), 'package-lock.json'),
] as const;

function hashString(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function readSourceFiles(target: string): string[] {
  try {
    const entries = readdirSync(target, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        files.push(...readSourceFiles(fullPath));
      } else if ((entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) && !entry.name.endsWith('.test.ts')) {
        files.push(fullPath);
      }
    }

    return files;
  } catch {
    return [];
  }
}

function readPipelineSource(target: string): string {
  try {
    return readFileSync(target, 'utf-8');
  } catch {
    return '';
  }
}

export function createPostConversionCacheVersion(linkPreviewCache: LinkPreviewCache): string {
  const sourceFiles = PIPELINE_SOURCE_PATHS.flatMap((target) => {
    if (target.endsWith('.ts') || target.endsWith('.json')) return [target];
    return readSourceFiles(target);
  }).sort();
  const sourceHash = hashString(sourceFiles.map((file) => `${file}\n${readPipelineSource(file)}`).join('\n'));

  const linkPreviewRenderData = Object.entries(linkPreviewCache)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, entry]) => [key, entry.error === true, entry.title, entry.description, entry.image, entry.card]);
  const linkPreviewHash = hashString(stableStringify(linkPreviewRenderData));

  return hashString(stableStringify([CACHE_SCHEMA_VERSION, sourceHash, linkPreviewHash]));
}

export function createRawPostCacheKey(raw: RawPost, version: string): string {
  return hashString(
    stableStringify({
      version,
      raw,
    }),
  );
}

export function loadPostConversionCache(version: string): PostConversionCache {
  try {
    const cache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8')) as PostConversionCache;
    if (cache.version === version && cache.entries && typeof cache.entries === 'object') {
      return cache;
    }
  } catch {
    // キャッシュがない、または壊れている場合は作り直す。
  }

  return { version, entries: {} };
}

export function savePostConversionCache(cache: PostConversionCache): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8');
}
