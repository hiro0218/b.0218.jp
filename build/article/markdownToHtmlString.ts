import rehypeShiki from '@shikijs/rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRaw from 'rehype-raw';
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
import { shikiConfig } from './shikiConfig';

const createBaseProcessor = () =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCjkFriendly)
    .use(remarkBreaks)
    .use(remarkRehype, { footnoteLabel: '注釈', allowDangerousHtml: true })
    .use(rehypeExternalLink)
    .use(rehypeMinifyWhitespace)
    .use(rehypeRaw);

export async function markdownToNoteHtmlString(markdown: string): Promise<string> {
  const result = await createBaseProcessor().use(rehypeStringify, { allowDangerousHtml: true }).process(markdown);

  return result.toString();
}

export async function markdownToPostHtmlString(markdown: string, options?: Rehype0218Options): Promise<string> {
  const processor = createBaseProcessor()
    .use(rehypeWrapImgWithFigure)
    .use(rehypeGfmAlert)
    .use(rehypeShiki, shikiConfig)
    .use(rehype0218, options)
    .use(rehypeRemoveComments)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(markdown);

  return result.toString();
}
