import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';

import rehype0218 from './rehype0218';
import rehypeGfmAlert from './rehypeGfmAlert';
import rehypeRemoveComments from './rehypeRemoveComments';
import remarkBreaks from './remarkBreaks';

const markdownToHtmlString = async (markdown: string, isSimple = false) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype, { footnoteLabel: '注釈', allowDangerousHtml: true })
    .use(rehypeGfmAlert)
    .use(rehypeMinifyWhitespace)
    .use(rehypeRaw);

  const result = isSimple
    ? await processor.use(rehypeStringify, { allowDangerousHtml: true }).process(markdown)
    : await processor
      .use(rehypeHighlight)
      .use(rehype0218)
      .use(rehypeRemoveComments)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdown);

  return result.toString();
};

export default markdownToHtmlString;
