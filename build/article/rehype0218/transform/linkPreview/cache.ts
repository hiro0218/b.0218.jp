import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { normalizeURL } from './url';

type OpgProps = {
  description?: string;
  image?: string;
  title?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
};

interface CacheEntry {
  title: string | null;
  description: string | null;
  image: string | null;
  card: string | null;
  fetchedAt: number;
  error?: boolean;
}

export type LinkPreviewCache = Record<string, CacheEntry>;

const CACHE_DIR = join(process.cwd(), 'node_modules', '.cache');
const CACHE_FILE = join(CACHE_DIR, 'link-preview.json');

/** 30 days in milliseconds */
const SUCCESS_TTL = 30 * 24 * 60 * 60 * 1000;
/** 1 day in milliseconds */
const ERROR_TTL = 24 * 60 * 60 * 1000;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isCacheEntry = (value: unknown): value is CacheEntry => {
  return isObject(value) && typeof value.fetchedAt === 'number';
};

const isExpiredEntry = (entry: CacheEntry): boolean => {
  const ttl = entry.error ? ERROR_TTL : SUCCESS_TTL;
  return Date.now() - entry.fetchedAt > ttl;
};

const pruneExpiredEntries = (cache: LinkPreviewCache): void => {
  for (const [key, entry] of Object.entries(cache)) {
    if (isExpiredEntry(entry)) {
      delete cache[key];
    }
  }
};

/**
 * キャッシュファイルを読み込む
 * ファイルが存在しない、またはJSONが壊れている場合は空オブジェクトを返す
 */
export const loadCache = (): LinkPreviewCache => {
  try {
    const raw = readFileSync(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;

    if (!isObject(parsed)) return {};

    const cache: LinkPreviewCache = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isCacheEntry(value)) {
        cache[key] = value;
      }
    }

    pruneExpiredEntries(cache);
    return cache;
  } catch {
    return {};
  }
};

/**
 * キャッシュをファイルに書き込む
 * ディレクトリが存在しない場合は再帰的に作成する
 */
export const saveCache = (cache: LinkPreviewCache): void => {
  pruneExpiredEntries(cache);
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
};

/**
 * 有効期限内のキャッシュエントリを取得する
 * 期限切れのエントリは削除してnullを返す
 */
const getValidEntry = (cache: LinkPreviewCache, url: string): CacheEntry | null => {
  const key = normalizeURL(url);
  const entry = cache[key];

  if (!entry) return null;
  if (isExpiredEntry(entry)) {
    delete cache[key];
    return null;
  }

  return entry;
};

/**
 * キャッシュからOGPデータを取得する
 * キャッシュミスまたは有効期限切れの場合はnullを返す
 * 成功エントリは30日、エラーエントリは1日のTTLを持つ
 */
export const getCachedOgp = (cache: LinkPreviewCache, url: string): OpgProps | null => {
  const entry = getValidEntry(cache, url);
  if (!entry || entry.error) return null;

  const ogp: OpgProps = {
    ...(entry.title != null && { title: entry.title }),
    ...(entry.description != null && { description: entry.description }),
    ...(entry.image != null && { image: entry.image }),
    ...(entry.card != null && { card: entry.card as OpgProps['card'] }),
  };

  if (Object.keys(ogp).length === 0) return null;

  return ogp;
};

/**
 * エラーキャッシュが有効期限内に存在するかを返す
 */
export const hasCachedError = (cache: LinkPreviewCache, url: string): boolean => {
  const entry = getValidEntry(cache, url);
  return entry?.error === true;
};

/**
 * キャッシュオブジェクトにエントリを追加する
 * ビルド時のデータ構造のため、オブジェクトを直接変更する
 */
export const setCacheEntry = (cache: LinkPreviewCache, url: string, ogp: OpgProps | null, isError = false): void => {
  const key = normalizeURL(url);

  cache[key] = {
    title: ogp?.title ?? null,
    description: ogp?.description ?? null,
    image: ogp?.image ?? null,
    card: ogp?.card ?? null,
    fetchedAt: Date.now(),
    ...(isError && { error: true }),
  };
};
