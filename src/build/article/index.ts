import fs from 'fs-extra';
import matter from 'gray-matter';
import readingTime from 'reading-time';

import { Post as PropPost } from '../../types/source';
import markdownToHtmlString from './markdownToHtmlString';

const path = {
  src: `${process.cwd()}/_article`,
  dist: `${process.cwd()}/dist`,
} as const;

/**
 * h2の内容をを取得して中身を取り出す
 */
function getHeading2Text(content: string) {
  return content
    .match(/<h2[^>]*>([^<]+)<\/h2>/g)
    ?.map((heading) => {
      return heading.replace('<h2>', '').replace('</h2>', '');
    })
    .join(' / ');
}

async function buildPost() {
  // md ファイル一覧を取得
  const files = fs.readdirSync(`${path.src}/_posts`).filter((file) => file.endsWith('.md'));
  const NUMBER_OF_FILES = files.length;
  const posts: Array<Partial<PropPost>> = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const post = matter.read(`${path.src}/_posts/${file}`);
    const { title, date, updated, note, tags, noindex }: Partial<PropPost> = post.data;
    const content = await markdownToHtmlString(post.content);
    const { text } = readingTime(content);

    posts.push({
      title,
      slug: file.replace('.md', ''),
      date,
      updated,
      note: await markdownToHtmlString(note, true),
      content: content,
      excerpt: getHeading2Text(content),
      tags,
      readingTime: text,
      noindex,
    });
  }

  // sort: 日付順
  posts.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });

  fs.ensureDirSync(`${path.dist}`);
  fs.writeJSONSync(`${path.dist}/posts.json`, posts);
  console.log('Write dist/posts.json');
  fs.writeJSONSync(`${path.dist}/posts-list.json`, removePostsData(posts));
  console.log('Write dist/posts-list.json');
}

function removePostsData(posts: Array<Partial<PropPost>>) {
  return posts.map((post) => {
    delete post.note;
    delete post.content;
    delete post.readingTime;

    return post;
  });
}

function buildTerms() {
  const posts: Array<PropPost> = fs.readJSONSync(`${path.dist}/posts.json`);
  const tagsMap = {};

  for (let i = 0; i < posts.length; i++) {
    const { title, slug, date, excerpt, tags } = posts[i];
    const item = {
      title,
      slug,
      date,
      excerpt,
    };

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

  fs.writeJSON(`${path.dist}/tags.json`, tagsMap).then(() => {
    console.log('Write dist/tags.json');
  });
}

async function buildPage() {
  // md ファイル一覧を取得
  const files = fs.readdirSync(`${path.src}`).filter((file) => file.endsWith('.md'));
  const NUMBER_OF_FILES = files.length;
  const pages: Array<Partial<PropPost>> = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const page = matter.read(`${path.src}/${file}`);
    const { title, date, updated }: Partial<PropPost> = page.data;
    const content = await markdownToHtmlString(page.content);

    pages.push({
      title,
      slug: file.replace('.md', ''),
      date,
      updated,
      content,
    });
  }

  fs.writeJSONSync(`${path.dist}/pages.json`, pages);
  console.log('Write dist/pages.json');
}

function copyFiles() {
  fs.copy(`${path.dist}/posts-list.json`, `public/posts-list.json`).then(() => {
    console.log('Copy dist/posts-list.json');
  });
  fs.copy(`${process.cwd()}/_article/images`, `public/images`).then(() => {
    console.log('Copy _article/images');
  });
}

(async () => {
  await buildPost();
  buildTerms();
  await buildPage();
  copyFiles();
})();
