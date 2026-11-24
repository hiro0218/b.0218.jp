import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build, type Plugin } from 'esbuild';
import type { Post } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { type LinkPreviewCache, renderingFields } from './linkPreviewCache';
import type { RawPost } from './raw';

type CacheEntry = {
  key: string;
  post: Post;
};

type PostConversionCache = {
  entries: Record<string, CacheEntry>;
  version: string;
};

const CACHE_SCHEMA_VERSION = 'post-conversion-v1';
const CACHE_FILE = path.join(BUILD_PATHS.cache, 'post-conversion.json');

// process.cwd() から求めない。metafile のパスは absWorkingDir からの相対になるので、post.test.ts のように cwd を差し替えると版の入力が変わるため
const REPO_ROOT = path.resolve(__dirname, '..', '..');

/** npm のパッケージ(node:fs などの組み込みも含む)は辿らず、package-lock.json で代表させる */
const externalPackages: Plugin = {
  name: 'external-packages',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^[^./~@]|^@[^/]/ }, () => ({ external: true }));
  },
};

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

/** 変換の出力を決めるファイルを、convert.ts と markdownToHtmlString.ts から import を辿って集める(リポジトリ直下からの相対パス)。一覧を手で持たない */
export async function listPipelineSources(): Promise<Array<string>> {
  const { metafile } = await build({
    entryPoints: [path.join(__dirname, 'convert.ts'), path.join(__dirname, 'markdownToHtmlString.ts')],
    absWorkingDir: REPO_ROOT,
    bundle: true,
    write: false,
    metafile: true,
    platform: 'node',
    logLevel: 'silent',
    // outdir を省かない。entry が複数あると esbuild が要求する(write: false なので何も書かれない)
    outdir: REPO_ROOT,
    plugins: [externalPackages],
  });

  return [...Object.keys(metafile.inputs), 'package-lock.json'].sort();
}

/** 解決できない import があると esbuild が throw する。握りつぶして一覧を空や一部にしない。ソースの変更が版に反映されなくなり、古い変換結果を使い続けるため */
export async function hashPipelineSources(): Promise<string> {
  const files = await listPipelineSources();
  const sources = await Promise.all(
    files.map(async (file) => `${file}\n${await readFile(path.join(REPO_ROOT, file), 'utf-8')}`),
  );

  return hashString(sources.join('\n'));
}

export function createPostConversionCacheVersion(sourceHash: string, linkPreviewCache: LinkPreviewCache): string {
  const linkPreviewHash = hashString(stableStringify(renderingFields(linkPreviewCache)));

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
  mkdirSync(BUILD_PATHS.cache, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8');
}
