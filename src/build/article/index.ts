import { copy, ensureDirSync, readdirSync, writeJSONSync } from 'fs-extra';
import matter from 'gray-matter';
import readingTime from 'reading-time';

import { FILENAME_PAGES, FILENAME_POSTS, FILENAME_POSTS_LIST } from '@/constant';
import * as Log from '@/lib/Log';
import type { PageProps, PostProps } from '@/types/source';

import markdownToHtmlString from './markdownToHtmlString';

const PATH = {
  SRC: `${process.cwd()}/_article`,
  DIST: `${process.cwd()}/dist`,
} as const;

/**
 * h2の内容をを取得して中身を取り出す
 */
function getHeading2Text(content: string) {
  const pattern = /<h2[^>]*>([^<]+)<\/h2>/g;
  let match: RegExpExecArray | null;
  const matches: string[] = [];

  while ((match = pattern.exec(content)) !== null) {
    matches.push(match[1]);
    if (pattern.lastIndex === match.index) {
      pattern.lastIndex++;
    }
  }

  if (!matches) {
    return '';
  }

  return matches.join(' / ');
}

async function buildPost() {
  // md ファイル一覧を取得
  const files = readdirSync(`${PATH.SRC}/_posts`).filter((file) => file.endsWith('.md'));
  const NUMBER_OF_FILES = files.length;
  const posts: PostProps[] = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const post = matter.read(`${PATH.SRC}/_posts/${file}`);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { title, date, updated, note, tags, noindex } = post.data as PostProps;
    const content = (await markdownToHtmlString(post.content)).trim();
    const noteContent = !!note ? await markdownToHtmlString(note, true) : '';
    const { minutes: readingTimeMinutes } = readingTime(content);

    posts.push({
      title: title.trim(),
      slug: file.replace('.md', ''),
      date: new Date(date).toISOString(),
      updated: updated ? new Date(updated).toISOString() : '',
      ...(noteContent && { note: noteContent }),
      content: content,
      excerpt: getHeading2Text(content),
      tags,
      readingTime: Math.round(readingTimeMinutes),
      noindex,
    });
  }

  // sort: 日付順
  posts.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });

  ensureDirSync(`${PATH.DIST}`);
  writeJSONSync(`${PATH.DIST}/${FILENAME_POSTS}.json`, posts);
  Log.info(`Write dist/${FILENAME_POSTS}.json`);

  return posts;
}

function buildPostList(posts: Partial<PostProps>[]) {
  writeJSONSync(`${PATH.DIST}/${FILENAME_POSTS_LIST}.json`, removePostsData(posts));
  Log.info(`Write dist/${FILENAME_POSTS_LIST}.json`);
}

function removePostsData(posts: Partial<PostProps>[]) {
  const length = posts.length;

  for (let i = 0; i < length; i++) {
    const post = posts[i];
    delete post.note;
    delete post.content;
    delete post.readingTime;
  }

  return posts;
}

function buildTerms(posts: Partial<PostProps>[]) {
  const tagsMap: {
    [key: string]: string[];
  } = {};

  for (let i = 0; i < posts.length; i++) {
    const { slug, tags } = posts[i];

    if (!slug || !tags) {
      continue;
    }

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const mappedTags = tagsMap[tag];

      if (mappedTags) {
        mappedTags.push(slug);
      } else {
        tagsMap[tag] = [slug];
      }
    }
  }

  writeJSONSync(`${PATH.DIST}/tags.json`, tagsMap);
  Log.info('Write dist/tags.json');
}

async function buildPage() {
  // md ファイル一覧を取得
  const files = readdirSync(`${PATH.SRC}`).filter((file) => file.endsWith('.md'));
  const NUMBER_OF_FILES = files.length;
  const pages: PageProps[] = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const page = matter.read(`${PATH.SRC}/${file}`);
    const { title, date, updated } = page.data as PageProps;
    const content = await markdownToHtmlString(page.content);

    pages.push({
      title,
      slug: file.replace('.md', ''),
      date,
      updated,
      content,
    });
  }

  writeJSONSync(`${PATH.DIST}/${FILENAME_PAGES}.json`, pages);
  Log.info(`Write dist/${FILENAME_PAGES}.json`);
}

function copyFiles() {
  copy(`${PATH.DIST}/${FILENAME_POSTS_LIST}.json`, `public/${FILENAME_POSTS_LIST}.json`).then(() => {
    Log.info(`Copy dist/${FILENAME_POSTS_LIST}.json`);
  });
  copy(`${process.cwd()}/_article/images`, `public/images`).then(() => {
    Log.info('Copy _article/images');
  });
}

(async () => {
  const posts = await buildPost();
  buildTerms(posts);
  buildPostList(posts);
  await buildPage();
  copyFiles();
})();
