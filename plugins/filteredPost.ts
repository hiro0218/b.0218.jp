import cheerio from 'cheerio';
import hljs from 'highlight.js';

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

    return $.html();
  });
};
