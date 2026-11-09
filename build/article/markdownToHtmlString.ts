import rehypeShiki from '@shikijs/rehype';
import type { Element, Root } from 'hast';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import type { Rehype0218Options } from './rehype0218';
import rehype0218 from './rehype0218';
import rehypeExternalLink from './rehypeExternalLink';
import rehypeGfmAlert from './rehypeGfmAlert';
import rehypeRemoveComments from './rehypeRemoveComments';
import rehypeWrapImgWithFigure from './rehypeWrapImgWithFigure';
import remarkBreaks from './remarkBreaks';
import { sanitizeSchema } from './sanitizeSchema';
import { shikiConfig } from './shikiConfig';

// remark-rehype の既定の接頭辞は使わず、clobberPrefix: '' にする。既定だと、注釈の id と href の両方に接頭辞が付く。
// rehypeSanitize は id・name・aria-describedby・aria-labelledby にだけ無条件で足し、href を変えない。
// 既定のままだと、id だけ二重（user-content-user-content-）になる。href の指す先は DOM に無くなる。
// rehypeSanitize の接頭辞は外さない。外すと、記事の生 HTML に書かれた id / name の DOM clobbering 対策が消える。
// 全リンクの書き換えと、クライアントでの hash の書き換えはしない。どちらも注釈以外の id を追う処理や script が要る。
function rehypeFootnoteHref() {
  const prefix = sanitizeSchema.clobberPrefix ?? '';

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const { href, dataFootnoteRef, dataFootnoteBackref } = node.properties;
      if (typeof href !== 'string' || !href.startsWith('#')) return;
      if (dataFootnoteRef === undefined && dataFootnoteBackref === undefined) return;

      node.properties.href = `#${prefix}${href.slice(1)}`;
    });
  };
}

// rehypeRaw 直後にサニタイズし、後段プラグイン (rehypeGfmAlert / rehype0218 等) が
// 生成する `<script type="application/json">` 等の信頼済みノードを保護対象外にする
// remarkRehype の既定の接頭辞は使わず、clobberPrefix: '' にする（理由は rehypeFootnoteHref）
function createBaseProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCjkFriendly)
    .use(remarkBreaks)
    .use(remarkRehype, { footnoteLabel: '注釈', allowDangerousHtml: true, clobberPrefix: '' })
    .use(rehypeRaw)
    .use(rehypeMinifyWhitespace)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeFootnoteHref)
    .use(rehypeExternalLink);
}

export function createMarkdownToNoteHtmlString(): (markdown: string) => Promise<string> {
  const processor = createBaseProcessor().use(rehypeStringify, { allowDangerousHtml: true });

  return async (markdown) => {
    const result = await processor.process(markdown);
    return result.toString();
  };
}

export function createMarkdownToPostHtmlString(options?: Rehype0218Options): (markdown: string) => Promise<string> {
  const processor = createBaseProcessor()
    .use(rehypeWrapImgWithFigure)
    .use(rehypeGfmAlert)
    .use(rehypeShiki, shikiConfig)
    .use(rehype0218, options)
    .use(rehypeRemoveComments)
    .use(rehypeStringify, { allowDangerousHtml: true });

  return async (markdown) => {
    const result = await processor.process(markdown);
    return result.toString();
  };
}
