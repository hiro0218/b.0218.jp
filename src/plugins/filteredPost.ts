import { Plugin } from '@nuxt/types';
import cheerio from 'cheerio';
import hljs from 'highlight.js';

const filteredPost: Plugin = (context) => {
  context.$filteredPost = (content: string) => {
    const $ = cheerio.load(content);

    // highlight.js
    $('pre code').each((_, element) => {
      const $element = $(element);
      const elementClass = $element.attr('class');

      if (elementClass) {
        const className = elementClass ? elementClass.replace('language-', '') : '';
        const result = hljs.highlightAuto($element.text(), [className]);

        if (className) {
          $element.attr('data-language', className);
        }

        $element.addClass('hljs');
        $element.html(result.value);
      }
    });

    // wrap table
    $('table').each((_, element) => {
      $(element).wrap($('<div class="table-container u-scroll-x"></div>'));
    });

    return $.html();
  };
};

export default filteredPost;
