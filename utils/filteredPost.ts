import cheerio from 'cheerio';

export const filteredPost = ($: typeof cheerio): string => {
  // 目次用のラッパー(details/summary)を挿入する
  const mokujiWrapper = '<div class="c-mokuji js-mokuji"><details><summary></summary></details></div>';
  if ($('.js-separate').length !== 0) {
    $('.js-separate').prepend(mokujiWrapper);
  } else {
    $.root().prepend(mokujiWrapper);
  }

  return $.html();
};
