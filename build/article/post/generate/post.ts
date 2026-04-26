import { readFileSync } from 'node:fs';
import pLimit from 'p-limit';
import { FILENAME_POSTS } from '@/constants';
import { isContentPreview } from '@/lib/config/environment';
import { convertRawPost } from '@/lib/post/convert';
import { isValidFrontmatter, parseFrontmatter, type RawPost } from '@/lib/post/raw';
import { isPubliclyVisible } from '@/lib/post/visibility';
import { mkdir, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import markdownToHtmlString from '../../markdownToHtmlString';
import { loadCache, saveCache } from '../../rehype0218';
import { buildTagNormalizationMap, normalizeTags } from './normalizeTag';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

const POST_CONCURRENCY = 4;

export async function buildPost() {
  const files = await getMarkdownFiles(`${PATH.from}/_posts`, 1);

  // Phase 1: parse, validate, and filter by visibility
  const rawPosts: RawPost[] = [];
  const visibilityCtx = { now: new Date(), isContentPreview };

  for (const file of files) {
    const source = readFileSync(`${PATH.from}/_posts/${file}`, 'utf-8');
    const { frontmatter, markdown } = parseFrontmatter(source);
    if (!isValidFrontmatter(frontmatter)) continue;

    const raw: RawPost = {
      slug: getSlug(file),
      content: markdown,
      title: frontmatter.title.trim(),
      date: new Date(frontmatter.date).toISOString(),
      updated: frontmatter.updated ? new Date(frontmatter.updated).toISOString() : undefined,
      note: typeof frontmatter.note === 'string' ? frontmatter.note : undefined,
      tags: frontmatter.tags || [],
      noindex: frontmatter.noindex,
    };

    if (!isPubliclyVisible(raw, visibilityCtx)) continue;

    rawPosts.push(raw);
  }

  // Phase 2: parallel Markdown -> HTML conversion (cache shared across posts)
  const sharedCache = loadCache();
  const limit = pLimit(POST_CONCURRENCY);
  const markdownToHtml = (md: string, isSimple = false) =>
    limit(() => markdownToHtmlString(md, isSimple, { sharedCache }));

  const posts = await Promise.all(rawPosts.map((raw) => convertRawPost(raw, { markdownToHtml })));
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
