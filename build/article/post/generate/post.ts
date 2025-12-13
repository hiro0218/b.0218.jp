import { read as matterRead } from 'gray-matter';
import { FILENAME_POSTS } from '@/constants';
import type { Post } from '@/types/source';
import { mkdir, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import markdownToHtmlString from '../../markdownToHtmlString';
import { buildTagNormalizationMap, normalizeTags } from './normalizeTag';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

export async function buildPost() {
  // md ファイル一覧を取得
  const files = await getMarkdownFiles(`${PATH.from}/_posts`);
  const posts: Post[] = [];

  // 記事一覧
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // front matter を取得
    const post = matterRead(`${PATH.from}/_posts/${file}`);
    const { title, date, updated, note, tags, noindex } = post.data as Post;

    // 未来の投稿はスキップ
    if (!process.env.IS_DEVELOPMENT && new Date(date) > new Date()) {
      continue;
    }

    const content = (await markdownToHtmlString(post.content)).trim();
    const noteContent = !!note ? await markdownToHtmlString(note, true) : '';
    const dateString = new Date(date).toISOString();
    const updatedString = updated ? new Date(updated).toISOString() : undefined;

    const postData: Post = {
      title: title.trim(),
      slug: getSlug(file),
      date: dateString,
      content: content,
      tags: tags || [],
      noindex,
    };

    if (updatedString) {
      postData.updated = updatedString;
    }

    if (noteContent) {
      postData.note = noteContent;
    }

    posts.push(postData);
  }

  // sort: 日付順
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // タグを正規化（異なる表記を統一）
  const normalizationMap = buildTagNormalizationMap(posts);
  for (const post of posts) {
    if (post.tags && post.tags.length > 0) {
      post.tags = normalizeTags(post.tags, normalizationMap);
    }
  }

  await mkdir(`${PATH.to}`, { recursive: true });
  await writeJSON(`${PATH.to}/${FILENAME_POSTS}.json`, posts).then(() => {
    Log.info(`Write dist/${FILENAME_POSTS}.json`);
  });

  return posts;
}
