import fs from 'fs-extra';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeRemoveComments from 'rehype-remove-comments';
import rehypeRemoveEmptyAttribute from 'rehype-remove-empty-attribute';
import rehypeRemoveEmptyParagraph from 'rehype-remove-empty-paragraph';
import rehypeStringify from 'rehype-stringify';
import rehypeWrap from 'rehype-wrap-all';
import remarkBreaks from 'remark-breaks';
import remarkExternalLinks from 'remark-external-links';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkUnwrapImages from 'remark-unwrap-images';
import { unified } from 'unified';

import { Post as PropPost } from '../types/source';
import remark0218 from './remark0218';

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

/**
 * markdownをhtml形式に変換
 */
async function markdown2html(markdown: string, simple = false) {
  const result = !simple
    ? await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkUnwrapImages)
        .use(remarkBreaks)
        .use(remarkExternalLinks, { rel: ['nofollow', 'noopener'] })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight, {
          subset: false,
          ignoreMissing: true,
        })
        .use(remark0218)
        .use(rehypeRemoveEmptyAttribute)
        .use(rehypeRemoveEmptyParagraph, { trimBr: true })
        .use(rehypeRemoveComments)
        .use(rehypeWrap, [
          {
            selector: 'table',
            wrapper: 'div.p-table-scroll',
          },
          {
            selector: 'table',
            wrapper: 'div.p-table-scroll__shadow',
          },
        ])
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown)
    : await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown);

  return result.toString();
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
    const { title, date, updated, note, tags }: Partial<PropPost> = post.data;
    const content = await markdown2html(post.content);
    const { text } = readingTime(content);

    posts.push({
      title,
      slug: file.replace('.md', ''),
      date,
      updated,
      note: await markdown2html(note, true),
      content: content,
      excerpt: getHeading2Text(content),
      tags,
      readingTime: text,
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

  posts.forEach((post) => {
    const { title, slug, date, excerpt, tags } = post;
    const item = {
      title,
      slug,
      date,
      excerpt,
    };

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
    const content = await markdown2html(page.content);

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
  fs.copyFileSync(`${path.dist}/posts-list.json`, `public/posts-list.json`);
  console.log('Copy dist/posts-list.json');
  fs.copySync(`${process.cwd()}/_article/images`, `public/images`);
  console.log('Copy _article/images');
}

buildPost();
buildTerms();
buildPage();
copyFiles();
