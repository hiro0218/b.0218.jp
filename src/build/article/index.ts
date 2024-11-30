import 'dotenv/config';

import { fdir } from 'fdir';
import { read as matterRead } from 'gray-matter';
import readingTime from 'reading-time';

import { FILENAME_PAGES, FILENAME_POSTS, FILENAME_POSTS_LIST } from '@/constant';
import * as Log from '@/shared/Log';
import { copyDir, copyFile, mkdir, writeJSON } from '@/shared/fs';
import type { PageProps, PostProps } from '@/types/source';
import { removePostsData } from './post/removePostData';

import markdownToHtmlString from './markdownToHtmlString';

const PATH = {
  from: `${process.cwd()}/_article`,
  to: `${process.cwd()}/dist`,
} as const;

const isMarkdown = (file: string) => file.endsWith('.md');
const getSlug = (file: string) => file.replace('.md', '');

async function buildPost() {
  // md ファイル一覧を取得
  const files = await new fdir()
    .filter((path) => isMarkdown(path))
    .crawl(`${PATH.from}/_posts`)
    .withPromise();
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
  writeJSON(`${PATH.to}/${FILENAME_POSTS}.json`, posts).then(() => {
    Log.info(`Write dist/${FILENAME_POSTS}.json`);
  });

  return posts;
}

async function buildPostList(posts: Partial<PostProps>[]) {
  await writeJSON(`${PATH.to}/${FILENAME_POSTS_LIST}.json`, removePostsData(posts)).then(() => {
    Log.info(`Write dist/${FILENAME_POSTS_LIST}.json`);
  });
}

async function buildTerms(posts: Partial<PostProps>[]) {
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

  writeJSON(`${PATH.to}/tags.json`, tagsMap).then(() => {
    Log.info('Write dist/tags.json');
  });

  const tagsWithCount = Object.entries(tagsMap)
    .map(([slug, val]) => {
      return {
        slug: slug,
        count: val.length,
      };
    })
    .sort((a, b) => b.count - a.count); // 件数の多い順にソート

  writeJSON(`${PATH.to}/tags-with-count.json`, [...tagsWithCount]).then(() => {
    Log.info('Write dist/tags-with-count.json');
  });
}

async function buildPage() {
  // md ファイル一覧を取得
  const files = await new fdir()
    .withMaxDepth(0)
    .filter((path) => isMarkdown(path))
    .crawl(PATH.from)
    .withPromise();
  const pages: PageProps[] = [];

  // 記事一覧
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // front matter を取得
    const page = matterRead(`${PATH.from}/${file}`);
    const { title, date, updated } = page.data as PageProps;
    const content = await markdownToHtmlString(page.content);

    pages.push({
      title,
      slug: getSlug(file),
      date,
      ...(updated && { updated: new Date(updated).toISOString() }),
      content,
    });
  }

  writeJSON(`${PATH.to}/${FILENAME_PAGES}.json`, pages).then(() => {
    Log.info(`Write dist/${FILENAME_PAGES}.json`);
  });
}

async function copyFiles() {
  copyFile(`${PATH.to}/${FILENAME_POSTS_LIST}.json`, `${process.cwd()}/public/${FILENAME_POSTS_LIST}.json`).then(() => {
    Log.info(`Copy dist/${FILENAME_POSTS_LIST}.json -> public`);
  });
  copyDir(`${process.cwd()}/_article/images`, `${process.cwd()}/public/images`).then(() => {
    Log.info('Copy _article/images -> public/images');
  });
}

(async () => {
  const posts = await buildPost();
  await buildTerms(posts);
  await buildPostList(posts);
  await buildPage();
  await copyFiles();
})();
