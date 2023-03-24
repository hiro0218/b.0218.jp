import { copy, ensureDirSync, readdirSync, readJSONSync, writeJSON, writeJSONSync } from 'fs-extra';
import matter from 'gray-matter';
import readingTime from 'reading-time';

import { FILENAME_PAGES, FILENAME_POSTS, FILENAME_POSTS_LIST } from '@/constant';
import * as Log from '@/lib/Log';
import { Page, Post as PropPost } from '@/types/source';

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
  const posts: Partial<PropPost>[] = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const post = matter.read(`${PATH.SRC}/_posts/${file}`);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { title, date, updated, note, tags, noindex }: Partial<PropPost> = post.data;
    const content = (await markdownToHtmlString(post.content)) || null;
    const noteContent = (await markdownToHtmlString(note, true)) || null;
    const { minutes: readingTimeMinutes } = readingTime(content);

    posts.push({
      title: title.trim(),
      slug: file.replace('.md', ''),
      date: new Date(date).toISOString(),
      updated: updated ? new Date(updated).toISOString() : '',
      ...(noteContent && { note: noteContent }),
      content: content.trim(),
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
  writeJSONSync(`${PATH.DIST}/${FILENAME_POSTS_LIST}.json`, removePostsData(posts));
  Log.info(`Write dist/${FILENAME_POSTS_LIST}.json`);
}

function removePostsData(posts: Partial<PropPost>[]) {
  return posts.map((post) => {
    delete post.note;
    delete post.content;
    delete post.readingTime;

    return post;
  });
}

function buildTerms() {
  const posts: PropPost[] = readJSONSync(`${PATH.DIST}/${FILENAME_POSTS}.json`);
  const tagsMap = {};

  for (let i = 0; i < posts.length; i++) {
    const { slug, tags } = posts[i];
    const item = slug;

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const mappedTags = tagsMap[tag];

      if (mappedTags) {
        mappedTags.push(item);
      } else {
        tagsMap[tag] = [item];
      }
    }
  }

  writeJSON(`${PATH.DIST}/tags.json`, tagsMap).then(() => {
    Log.info('Write dist/tags.json');
  });
}

async function buildPage() {
  // md ファイル一覧を取得
  const files = readdirSync(`${PATH.SRC}`).filter((file) => file.endsWith('.md'));
  const NUMBER_OF_FILES = files.length;
  const pages: Page[] = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const page = matter.read(`${PATH.SRC}/${file}`);
    const { title, date, updated }: Partial<Page> = page.data;
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
  await buildPost();
  buildTerms();
  await buildPage();
  copyFiles();
})();
