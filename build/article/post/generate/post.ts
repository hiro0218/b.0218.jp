import { readFileSync } from 'node:fs';
import pLimit from 'p-limit';
import { FILENAME_POSTS } from '@/constants';
import { isContentPreview } from '@/lib/config/environment';
import { convertRawPost } from '@/lib/post/convert';
import { isValidFrontmatter, parseFrontmatter, type RawPost, tryToIso } from '@/lib/post/raw';
import { isPubliclyVisible } from '@/lib/post/visibility';
import { mkdir, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { createMarkdownToNoteHtmlString, createMarkdownToPostHtmlString } from '../../markdownToHtmlString';
import { loadCache, saveCache } from '../../rehype0218';
import {
  createPostConversionCacheVersion,
  createRawPostCacheKey,
  loadPostConversionCache,
  savePostConversionCache,
} from './cache';
import { buildTagNormalizationMap, normalizeTags } from './normalizeTag';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

const POST_CONCURRENCY = 4;

export async function buildPost() {
  const files = await getMarkdownFiles(`${PATH.from}/_posts`, 1);

  const rawPosts: RawPost[] = [];
  const visibilityCtx = { now: new Date(), isContentPreview };

  for (const file of files) {
    const source = readFileSync(`${PATH.from}/_posts/${file}`, 'utf-8');
    const { frontmatter, markdown } = parseFrontmatter(source);
    if (!isValidFrontmatter(frontmatter)) {
      Log.info(`Skip post with invalid frontmatter: ${file}`);
      continue;
    }

    const raw: RawPost = {
      slug: getSlug(file),
      content: markdown,
      title: frontmatter.title.trim(),
      date: tryToIso(frontmatter.date) ?? '',
      updated: tryToIso(frontmatter.updated),
      note: typeof frontmatter.note === 'string' ? frontmatter.note : undefined,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.filter((t): t is string => typeof t === 'string') : [],
      noindex: typeof frontmatter.noindex === 'boolean' ? frontmatter.noindex : undefined,
    };

    if (!isPubliclyVisible(raw, visibilityCtx)) {
      Log.info(`Skip future-dated post: ${file}`);
      continue;
    }

    rawPosts.push(raw);
  }

  // 投稿間で共有し、重複する link-preview 断片がキャッシュヒットするようにする
  const sharedCache = loadCache();
  const cacheVersion = createPostConversionCacheVersion(sharedCache);
  const conversionCache = loadPostConversionCache(cacheVersion);
  const nextCacheEntries: typeof conversionCache.entries = {};
  const limit = pLimit(POST_CONCURRENCY);
  const postHtmlProcessor = createMarkdownToPostHtmlString({ sharedCache });
  const noteHtmlProcessor = createMarkdownToNoteHtmlString();
  const markdownToPostHtml = (md: string) => limit(() => postHtmlProcessor(md));
  const markdownToNoteHtml = (md: string) => limit(() => noteHtmlProcessor(md));
  let cacheHits = 0;
  let cacheMisses = 0;

  const posts = await Promise.all(
    rawPosts.map(async (raw) => {
      const key = createRawPostCacheKey(raw, cacheVersion);
      const cached = conversionCache.entries[raw.slug];

      if (cached?.key === key) {
        cacheHits++;
        nextCacheEntries[raw.slug] = cached;
        return cached.post;
      }

      cacheMisses++;
      const post = await convertRawPost(raw, { markdownToPostHtml, markdownToNoteHtml });
      nextCacheEntries[raw.slug] = { key, post };
      return post;
    }),
  );
  conversionCache.entries = nextCacheEntries;
  savePostConversionCache(conversionCache);
  Log.info(`Post conversion cache: ${cacheHits} hit, ${cacheMisses} miss`);
  saveCache(sharedCache);

  // sort: 日付順
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // タグを正規化（異なる表記を統一）
  const normalizationMap = buildTagNormalizationMap(posts);
  const normalizedPosts = posts.map((post) => {
    if (post.tags && post.tags.length > 0) {
      return { ...post, tags: normalizeTags(post.tags, normalizationMap) };
    }
    return post;
  });

  // 記事単位の個別JSONファイルを生成
  const postsDir = `${PATH.to}/${FILENAME_POSTS}`;
  await mkdir(postsDir, { recursive: true });
  await Promise.all(normalizedPosts.map((post) => writeJSON(`${postsDir}/${post.slug}.json`, post)));
  Log.info(`Write dist/${FILENAME_POSTS}/ (${normalizedPosts.length} files)`);

  return normalizedPosts;
}
