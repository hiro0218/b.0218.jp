import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRaw from 'rehype-raw';
import rehypeRemoveComments from 'rehype-remove-comments';
import rehypeRemoveEmptyAttribute from 'rehype-remove-empty-attribute';
import rehypeRemoveEmptyParagraph from 'rehype-remove-empty-paragraph';
import rehypeStringify from 'rehype-stringify';
import rehypeWrap from 'rehype-wrap-all';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkUnwrapImages from 'remark-unwrap-images';
import { unified } from 'unified';

import { SITE_URL } from '@/constant';

import remark0218 from './remark0218';

const markdownToHtmlString = async (markdown: string, simple = false) => {
  const commonProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkUnwrapImages)
    .use(remarkBreaks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMinifyWhitespace)
    .use(rehypeRaw);

  const result = !simple
    ? await commonProcessor
        .use(rehypeExternalLinks, {
          target(element) {
            return !(element.properties.href as string).includes(SITE_URL) ? '_blank' : undefined;
          },
          rel: ['nofollow'],
        })
        .use(rehypeHighlight, {
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
        ])
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown)
    : await commonProcessor.use(rehypeStringify, { allowDangerousHtml: true }).process(markdown);

  return result.toString();
};

export default markdownToHtmlString;
