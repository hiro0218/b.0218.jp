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

/**
 * h2の内容をを取得して中身を取り出す
 */
export const getHeadingText = ($: typeof cheerio, tagName = 'h2') => {
  return $(tagName)
    .map(function (i) {
      return i < 5 && $(this).text();
    })
    .toArray()
    .join(' / ');
};
