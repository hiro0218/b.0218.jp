import cheerio from 'cheerio';

const filteredPost = (content: string): string => {
  const $ = cheerio.load(content);

  // image
  $('img').each((_, element) => {
    $(element).attr('loading', 'lazy');
  });

  // hljs
  $('pre code').each((_, element) => {
    const $element = $(element);
    const elementClass = $element.attr('class');

    if (elementClass) {
      const className = elementClass ? elementClass.replace('language-', '').replace('hljs ', '') : '';

      if (className) {
        $element.attr('data-language', className);
      }
    }
  });

  // wrap table
  $('table').each((_, element) => {
    $(element).wrap($('<div class="p-post-table-container"></div>'));
  });

  // 目次用のラッパー(details/summary)を挿入する
  const mokujiWrapper = '<div class="c-mokuji js-mokuji"><details><summary></summary></details></div>';
  if ($('.js-separate').length !== 0) {
    $('.js-separate').prepend(mokujiWrapper);
  } else {
    $.root().prepend(mokujiWrapper);
  }

  return $.html();
};

export default filteredPost;
