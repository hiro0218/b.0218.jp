import rehypeHighlight from 'rehype-highlight';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import rehype0218 from './rehype0218';
import rehypeExternalLink from './rehypeExternalLink';
import rehypeGfmAlert from './rehypeGfmAlert';
import rehypeRemoveComments from './rehypeRemoveComments';
import rehypeWrapImgWithFigure from './rehypeWrapImgWithFigure';
import remarkBreaks from './remarkBreaks';

const markdownToHtmlString = async (markdown: string, isSimple = false) => {
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
        .use(rehypeHighlight)
        .use(rehype0218)
        .use(rehypeRemoveComments)
        .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(markdown);

  return result.toString();
};

export default markdownToHtmlString;
