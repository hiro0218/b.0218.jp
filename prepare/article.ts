import cheerio from 'cheerio';
import fs from 'fs-extra';
import matter from 'gray-matter';
import rehypeHighlight from 'rehype-highlight';
import rehypeLazyLoad from 'rehype-plugin-image-native-lazy-loading';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkExternalLinks from 'remark-external-links';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkUnwrapImages from 'remark-unwrap-images';
import unified from 'unified';

import { NextPrevPost, Post as PropPost } from '../types/source';

const path = {
  src: `${process.cwd()}/_article`,
  dist: `${process.cwd()}/dist`,
} as const;

/**
 * <!--more--> を置き換える
 */
function replaceMoreComment(content: string) {
  return content.replace('<!--more-->', '\r\n<div class="more js-separate"></div>\r\n');
}

/**
 * h2の内容をを取得して中身を取り出す
 */
function getHeadings(content: string) {
  const $ = cheerio.load(content);
  const $h2 = $('h2');
  const headings = [];

  $h2.each(function (i) {
    // 5つだけ抽出
    if (i < 5) {
      headings[i] = $(this).text();
    }
  });

  return headings.join(' / ');
}

/**
 * markdownをhtml形式に変換
 */
function markdown2html(markdown: string) {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkUnwrapImages)
    .use(remarkBreaks)
    .use(remarkExternalLinks, { rel: ['nofollow', 'noopener'] })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeLazyLoad)
    .use(rehypeHighlight, {
      subset: false,
      ignoreMissing: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(markdown);

  return result.toString();
}

function buildPost() {
  // md ファイル一覧を取得
  const files = fs.readdirSync(`${path.src}/_posts`).filter((file) => file.endsWith('.md'));
  const NUMBER_OF_FILES = files.length;
  const posts: Array<Partial<PropPost>> = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const post = matter.read(`${path.src}/_posts/${file}`);
    const { title, date, updated, categories, tags }: Partial<PropPost> = post.data;
    const content = markdown2html(post.content);

    posts.push({
      title,
      slug: file.replace('.md', ''),
      date,
      updated,
      content: replaceMoreComment(content),
      excerpt: getHeadings(content),
      categories,
      tags,
    });
  }

  // 記事一覧に付加情報を追加
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const post = posts[i];

    post.prev = (() => {
      if (i <= 0) return {};

      const { title, slug } = posts[i - 1];

      return { title, slug };
    })() as NextPrevPost;
    post.next = (() => {
      if (i >= NUMBER_OF_FILES - 1) return {};

      const { title, slug } = posts[i + 1];

      return { title, slug };
    })() as NextPrevPost;
  }

  // sort: 日付順
  posts.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });

  fs.ensureDirSync(`${path.dist}`);
  fs.writeJSONSync(`${path.dist}/posts.json`, posts);
  console.log('Write dist/posts.json');
}

function buildTerms() {
  const posts: Array<PropPost> = fs.readJSONSync(`${path.dist}/posts.json`);
  const tagsMap = {};
  const categoriesMap = {};

  posts.forEach((post) => {
    const { title, slug, date, excerpt, categories, tags } = post;
    const item = {
      title,
      slug,
      date,
      excerpt,
    };

    categories?.forEach((category) => {
      const mappedCategories = categoriesMap[category];

      if (mappedCategories) {
        mappedCategories.push(item);
      } else {
        categoriesMap[category] = [item];
      }
    });

    tags?.forEach((tag) => {
      const mappedTags = tagsMap[tag];

      if (mappedTags) {
        mappedTags.push(item);
      } else {
        tagsMap[tag] = [item];
      }
    });
  });

  fs.writeJSONSync(`${path.dist}/tags.json`, tagsMap);
  console.log('Write dist/tags.json');
  fs.writeJSONSync(`${path.dist}/categories.json`, categoriesMap);
  console.log('Write dist/categories.json');
}

function buildPage() {
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
    const content = markdown2html(page.content);

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
  fs.copyFileSync(`${path.dist}/posts.json`, `public/posts.json`);
  console.log('Copy dist/posts.json');
  fs.copySync(`${process.cwd()}/_article/images`, `public/images`);
  console.log('Copy _article/images');
}

buildPost();
buildTerms();
buildPage();
copyFiles();
