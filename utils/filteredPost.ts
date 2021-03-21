import cheerio from 'cheerio';
import hljs from 'highlight.js';

const filteredPost = (content: string) => {
  const $ = cheerio.load(content);

  // hljs
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

  return $.html();
};

export default filteredPost;
