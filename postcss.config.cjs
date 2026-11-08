// 記事の 2 列（--isPostTwoColumn）を px にそろえない。rem の media query は、利用者の既定の文字サイズに追従する。px だと追従しない。
// @container (min-width: 40rem) を --isWide に寄せない。container query は配置先の幅で決まる。viewport の幅とは別の判断である。
// next dev は起動時に読んだこの設定を使い続ける。breakpoints.json を変えたら再起動する。再起動しないと、足した名前が @media に名前のまま残り、どの幅でも効かない
const breakpoints = require('./src/ui/breakpoints.json');

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-custom-media-generator': {
      '--isDesktop': `(min-width: ${breakpoints.desktopPx}px)`,
      '--isPostTwoColumn': `(min-width: ${breakpoints.postTwoColumnRem}rem)`,
      '--isWide': `(min-width: ${breakpoints.wideRem}rem)`,
    },
    'postcss-custom-media': {},
    'postcss-media-hover-any-hover': {},
    '@pandacss/dev/postcss': {},
  },
};
