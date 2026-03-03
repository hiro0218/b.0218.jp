import { read as matterRead } from 'gray-matter';
import pLimit from 'p-limit';
import { FILENAME_POSTS } from '@/constants';
import type { Post } from '@/types/source';
import { mkdir, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import markdownToHtmlString from '../../markdownToHtmlString';
import type { LinkPreviewCache } from '../../rehype0218';
import { loadCache, saveCache } from '../../rehype0218';
import { buildTagNormalizationMap, normalizeTags } from './normalizeTag';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

const POST_CONCURRENCY = 4;

interface RawPost {
  content: string;
  title: string;
  slug: string;
  date: string;
  updated?: string;
  note?: string;
  tags: string[];
  noindex?: boolean;
}

async function convertRawPost(
  raw: RawPost,
  limit: ReturnType<typeof pLimit>,
  sharedCache: LinkPreviewCache,
): Promise<Post> {
  const content = await limit(() => markdownToHtmlString(raw.content, false, { sharedCache }));
  const noteContent = raw.note ? await markdownToHtmlString(raw.note, true) : '';

  const post: Post = {
    title: raw.title,
    slug: raw.slug,
    date: raw.date,
    content: content.trim(),
    tags: raw.tags,
    noindex: raw.noindex,
  };

  if (raw.updated) {
    post.updated = raw.updated;
  }

  if (noteContent) {
    post.note = noteContent;
  }

  return post;
}

export async function buildPost() {
  // md ファイル一覧を取得
  const files = await getMarkdownFiles(`${PATH.from}/_posts`, 1);

  // Phase 1: front matter の読み込みとフィルタリング（同期処理）
  const rawPosts: RawPost[] = [];

  for (const file of files) {
    const post = matterRead(`${PATH.from}/_posts/${file}`);
    const { title, date, updated, note, tags, noindex } = post.data as Post;

    // 未来の投稿はスキップ
    const dateObj = new Date(date);
    if (!process.env.IS_DEVELOPMENT && dateObj > new Date()) {
      continue;
    }

    rawPosts.push({
      content: post.content,
      title: title.trim(),
      slug: getSlug(file),
      date: dateObj.toISOString(),
      updated: updated ? new Date(updated).toISOString() : undefined,
      note: typeof note === 'string' ? note : undefined,
      tags: tags || [],
      noindex,
    });
  }

  // Phase 2: Markdown → HTML 変換を並列実行（キャッシュ共有）
  const sharedCache = loadCache();
  const limit = pLimit(POST_CONCURRENCY);

  const posts = await Promise.all(rawPosts.map((raw) => convertRawPost(raw, limit, sharedCache)));
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
