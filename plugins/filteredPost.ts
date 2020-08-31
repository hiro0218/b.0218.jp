import cheerio from 'cheerio';
import hljs from 'highlight.js';

import CONSTANT from '~/constant';

export default (_, inject) => {
  inject('filteredPost', (content: string) => {
    const $ = cheerio.load(content);

    // highlight.js
    $('pre code').each((_, element) => {
      const elementClass = $(element).attr('class');
      const className = elementClass ? elementClass.replace('language-', '') : '';
      const result = hljs.highlightAuto($(element).text(), [className]);

      if (className) {
        $(element).attr('data-language', className);
      }

      $(element).addClass('hljs');
      $(element).html(result.value);
    });

    // wrap table
    $('table').each((_, element) => {
      $(element).wrap($('<div class="table-container u-scroll-x"></div>'));
    });

    // external link
    $('a[href^=http]').each((_, element) => {
      // 外部リンクのみ付与する
      if (!$(element).attr('href').includes(CONSTANT.SITE_URL)) {
        $(element).attr('target', '_blank');
        $(element).attr('rel', 'nofollow');
        $(element).attr('rel', 'noopener');
      }
    });

    return $.html();
  });
};
