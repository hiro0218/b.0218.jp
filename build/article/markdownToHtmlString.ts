import rehypeShiki from '@shikijs/rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { collectText } from './hastUtils';
import rehype0218 from './rehype0218';
import rehypeExternalLink from './rehypeExternalLink';
import rehypeGfmAlert from './rehypeGfmAlert';
import rehypeRemoveComments from './rehypeRemoveComments';
import rehypeWrapImgWithFigure from './rehypeWrapImgWithFigure';
import remarkBreaks from './remarkBreaks';

async function markdownToHtmlString(markdown: string, isSimple = false): Promise<string> {
  const baseProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype, { footnoteLabel: '注釈', allowDangerousHtml: true })
    .use(rehypeExternalLink)
    .use(rehypeMinifyWhitespace)
    .use(rehypeRaw);

  const processor = isSimple
    ? baseProcessor.use(rehypeStringify, { allowDangerousHtml: true })
    : baseProcessor
        .use(rehypeWrapImgWithFigure)
        .use(rehypeGfmAlert)
        .use(rehypeShiki, {
          themes: {
            light: 'one-light',
            dark: 'one-dark-pro',
          },
          defaultColor: false,
          transformers: [
            {
              name: 'add-language-attribute',
              code(node) {
                const lang = this.options.lang;
                if (lang) {
                  node.properties['data-language'] = lang;
                }
              },
            },
            {
              name: 'diff-line-highlight',
              line(node) {
                if (this.options.lang !== 'diff') return;
                const text = collectText(node.children);
                if (text.startsWith('+')) {
                  node.properties['data-diff'] = 'add';
                } else if (text.startsWith('-')) {
                  node.properties['data-diff'] = 'remove';
                }
              },
            },
          ],
        })
        .use(rehype0218)
        .use(rehypeRemoveComments)
        .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(markdown);

  return result.toString();
}

export default markdownToHtmlString;
