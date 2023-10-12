import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { SITE_URL } from '@/constant';

import rehype0218 from './rehype0218';
import remarkBreaks from './remarkBreaks';
import remarkGfmAlert from './remarkGfmAlert';

const markdownToHtmlString = async (markdown: string, simple = false) => {
  const commonProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGfmAlert)
    .use(remarkBreaks)
    .use(remarkRehype, { footnoteLabel: '注釈', allowDangerousHtml: true })
    .use(rehypeExternalLinks, {
      target(element) {
        return !(element?.properties?.href as string).includes(SITE_URL) ? '_blank' : undefined;
      },
      rel: ['nofollow'],
    })
    .use(rehypePresetMinify)
    .use(rehypeRaw);

  const result = !simple
    ? await commonProcessor
        .use(rehypeHighlight)
        .use(rehype0218)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown)
    : await commonProcessor.use(rehypeStringify, { allowDangerousHtml: true }).process(markdown);

  return result.toString();
};

export default markdownToHtmlString;
