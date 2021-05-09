const fs = require('fs-extra');
const cheerio = require('cheerio');
const matter = require('gray-matter');

const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkRehype = require('remark-rehype');
const remarkGfm = require('remark-gfm');
const rehypeStringify = require('rehype-stringify');
const rehypeHighlight = require('rehype-highlight');
const remarkBreaks = require('remark-breaks');
const remarkUnwrapImages = require('remark-unwrap-images');
const remarkExternalLinks = require('remark-external-links');

const path = {
  src: `${process.cwd()}/_article`,
  dist: `${process.cwd()}/dist`,
};

/**
 * h2の内容をを取得して中身を取り出す
 * @param {string} content
 * @returns {string}
 */
function getHeadings(content) {
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
 * @param {string} markdown
 * @returns {string}
 */
function markdown2html(markdown) {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkUnwrapImages)
    .use(remarkBreaks)
    .use(remarkExternalLinks, { rel: ['nofollow', 'noopener'] })
    .use(remarkRehype, { allowDangerousHtml: true })
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
  const posts = [];

  // 記事一覧
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    const file = files[i];

    // front matter を取得
    const post = matter.read(`${path.src}/_posts/${file}`);
    const { title, date, updated, categories, tags } = post.data;
    const content = markdown2html(post.content);

    posts.push({
      title,
      slug: file.replace('.md', ''),
      date,
      updated,
      content: content,
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
    })();
    post.next = (() => {
      if (i >= NUMBER_OF_FILES - 1) return {};

      const { title, slug } = posts[i + 1];

      return { title, slug };
    })();
  }

  // sort: 日付順
  posts.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });

  fs.ensureDirSync(`${path.dist}`);
  fs.writeJSONSync(`${path.dist}/posts.json`, posts);
}

function buildTerms() {
  const posts = fs.readJSONSync(`${path.dist}/posts.json`);
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

    categories.forEach((category) => {
      const mappedCategories = categoriesMap[category];

      if (mappedCategories) {
        mappedCategories.push(item);
      } else {
        categoriesMap[category] = [item];
      }
    });

    tags.forEach((tag) => {
      const mappedTags = tagsMap[tag];

      if (mappedTags) {
        mappedTags.push(item);
      } else {
        tagsMap[tag] = [item];
      }
    });
  });

  fs.writeJSONSync(`${path.dist}/tags.json`, tagsMap);
  fs.writeJSONSync(`${path.dist}/categories.json`, categoriesMap);
}

buildPost();
buildTerms();
