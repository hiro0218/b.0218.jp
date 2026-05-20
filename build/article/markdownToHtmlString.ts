import rehypeShiki from '@shikijs/rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import type { Rehype0218Options } from './rehype0218';
import rehype0218 from './rehype0218';
import rehypeExternalLink from './rehypeExternalLink';
import rehypeGfmAlert from './rehypeGfmAlert';
import rehypeRemoveComments from './rehypeRemoveComments';
import rehypeWrapImgWithFigure from './rehypeWrapImgWithFigure';
import remarkBreaks from './remarkBreaks';
import { sanitizeSchema } from './sanitizeSchema';
import { shikiConfig } from './shikiConfig';

// rehypeRaw 直後にサニタイズし、後段プラグイン (rehypeGfmAlert / rehype0218 等) が
// 生成する `<script type="application/json">` 等の信頼済みノードを保護対象外にする
function createBaseProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCjkFriendly)
    .use(remarkBreaks)
    .use(remarkRehype, { footnoteLabel: '注釈', allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMinifyWhitespace)
    .use(rehypeSanitize, sanitizeSchema)
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
