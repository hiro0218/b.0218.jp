import { FILENAME_POSTS } from '@/constant';
import * as Log from '@/shared/Log';
import { mkdir, writeJSON } from '@/shared/fs';
import type { PostProps } from '@/types/source';
import { read as matterRead } from 'gray-matter';
import readingTime from 'reading-time';
import markdownToHtmlString from '../../markdownToHtmlString';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

export async function buildPost() {
  // md ファイル一覧を取得
  const files = await getMarkdownFiles(`${PATH.from}/_posts`);
  const posts: PostProps[] = [];

  // 記事一覧
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // front matter を取得
    const post = matterRead(`${PATH.from}/_posts/${file}`);
    const { title, date, updated, note, tags, noindex } = post.data as PostProps;

    // 未来の投稿はスキップ
    if (!process.env.IS_DEVELOPMENT && new Date(date) > new Date()) {
      continue;
    }

    const content = (await markdownToHtmlString(post.content)).trim();
    const noteContent = !!note ? await markdownToHtmlString(note, true) : '';
    const { minutes: readingTimeMinutes } = readingTime(content);

    posts.push({
      title: title.trim(),
      slug: getSlug(file),
      date: new Date(date).toISOString(),
      ...(updated && { updated: new Date(updated).toISOString() }),
      ...(noteContent && { note: noteContent }),
      content: content,
      tags,
      readingTime: Math.round(readingTimeMinutes),
      noindex,
    });
  }

  // sort: 日付順
  posts.sort((a, b) => b.date.localeCompare(a.date));

  await mkdir(`${PATH.to}`, { recursive: true });
  await writeJSON(`${PATH.to}/${FILENAME_POSTS}.json`, posts).then(() => {
    Log.info(`Write dist/${FILENAME_POSTS}.json`);
  });

  return posts;
}
