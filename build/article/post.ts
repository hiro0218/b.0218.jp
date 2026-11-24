import { readFileSync } from 'node:fs';
import pLimit from 'p-limit';
import { FILENAME_POSTS } from '@/constants';
import type { Post } from '@/types/source';
import { writeDistPosts } from '~/build/shared/dist';
import * as Log from '~/build/shared/logger';
import { BUILD_PATHS } from '~/build/shared/paths';
import {
  createPostConversionCacheVersion,
  createRawPostCacheKey,
  hashPipelineSources,
  loadPostConversionCache,
  savePostConversionCache,
} from './conversionCache';
import { convertRawPost } from './convert';
import { loadCache, saveCache } from './linkPreviewCache';
import { createMarkdownToNoteHtmlString, createMarkdownToPostHtmlString } from './markdownToHtmlString';
import { buildTagNormalizationMap, normalizeTags } from './normalizeTag';
import { buildPage } from './page';
import { isValidFrontmatter, parseFrontmatter, type RawPost, tryToIso } from './raw';
import { getMarkdownFiles, getSlug } from './utils';
import { isPubliclyVisible } from './visibility';

const POST_CONCURRENCY = 4;

export async function buildPost(): Promise<Post[]> {
  const files = await getMarkdownFiles(BUILD_PATHS.posts, 1);

  const rawPosts: RawPost[] = [];
  // モジュールの先頭で評価しない。import 時に決まると、index.ts の loadEnvConfig より先になり、.env の IS_DEVELOPMENT が効かないため
  const visibilityCtx = { now: new Date(), isContentPreview: process.env.IS_DEVELOPMENT === 'true' };

  for (const file of files) {
    const source = readFileSync(`${BUILD_PATHS.posts}/${file}`, 'utf-8');
    const { frontmatter, markdown } = parseFrontmatter(source);
    if (!isValidFrontmatter(frontmatter)) {
      Log.info(`Skip post with invalid frontmatter: ${file}`);
      continue;
    }

    const raw: RawPost = {
      slug: getSlug(file),
      markdown,
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
  const sourceHash = await hashPipelineSources();
  const cacheVersion = createPostConversionCacheVersion(sourceHash, sharedCache);
  const conversionCache = loadPostConversionCache(cacheVersion);
  const nextCacheEntries: typeof conversionCache.entries = {};
  const limit = pLimit(POST_CONCURRENCY);
  const postHtmlProcessor = createMarkdownToPostHtmlString({ sharedCache });
  const noteHtmlProcessor = createMarkdownToNoteHtmlString();
  const markdownToPostHtml = (md: string) => limit(() => postHtmlProcessor(md));
  const markdownToNoteHtml = (md: string) => limit(() => noteHtmlProcessor(md));
  let cacheHits = 0;
  const converted = new Map<RawPost, Post>();

  const posts = await Promise.all(
    rawPosts.map(async (raw) => {
      const key = createRawPostCacheKey(raw, cacheVersion);
      const cached = conversionCache.entries[raw.slug];

      if (cached?.key === key) {
        cacheHits++;
        nextCacheEntries[raw.slug] = cached;
        return cached.post;
      }

      const post = await convertRawPost(raw, { markdownToPostHtml, markdownToNoteHtml });
      converted.set(raw, post);
      return post;
    }),
  );
  // Page の変換を saveCache の後ろ(index.ts の並列段)に置かない。保存した版より後に link-preview のエントリが増え、次回の版とずれて全記事を再変換するため
  await buildPage(markdownToPostHtml);
  saveCache(sharedCache);

  // 保存する版は、変換前でなく変換後のリンクプレビューから決める。変換前の版で保存すると、取得したリンクの分だけ次回の版とずれ、全記事が再変換になる
  // キャッシュに当たった記事のキーは付け替えない。変わったリンクプレビューを含むかは調べず、次回は再変換する
  const savedVersion = createPostConversionCacheVersion(sourceHash, sharedCache);
  for (const [raw, post] of converted) {
    nextCacheEntries[raw.slug] = { key: createRawPostCacheKey(raw, savedVersion), post };
  }
  savePostConversionCache({ version: savedVersion, entries: nextCacheEntries });
  Log.info(`Post conversion cache: ${cacheHits} hit, ${converted.size} miss`);

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
  await writeDistPosts(normalizedPosts);
  Log.info(`Write dist/${FILENAME_POSTS}/ (${normalizedPosts.length} files)`);

  return normalizedPosts;
}
