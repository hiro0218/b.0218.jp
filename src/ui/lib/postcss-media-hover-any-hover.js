/**
 * :hoverを含むセレクタを`@media (hover: hover)`でラップする
 *
 * @type {import('postcss').PluginCreator}
 * @returns {Object} - PostCSS plugin object.
 */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-media-hover-any-hover',
    /**
     * @param {import('postcss').Root} root - PostCSS root node.
     * @param {import('postcss').Result} postcss - PostCSS result object.
     */
    Once(root, { AtRule }) {
      /** @param {import('postcss').Rule} rule - PostCSS rule node. */
      root.walkRules((rule) => {
        const { selectors } = rule;
        /** @type {string[]} */
        const hoverSelectors = [];
        /** @type {string[]} */
        const nonHoverSelectors = [];
        const hoverRegex = /:hover/;
        const len = selectors.length;

        // :hoverを含むセレクタと含まないセレクタを分割
        for (let i = 0; i < len; i++) {
          const selector = selectors[i];
          if (hoverRegex.test(selector)) {
            hoverSelectors.push(selector);
          } else {
            nonHoverSelectors.push(selector);
          }
        }

        // :hoverを含むセレクタがない場合は処理を行わない
        if (hoverSelectors.length === 0) {
          return;
        }

        // hoverセレクタをラップする@mediaルールを作成
        const atRule = new AtRule({ name: 'media', params: '(hover: hover)' });

        // 非hoverセレクタがある場合、ルールを複製してhover @mediaを前に追加
        // それ以外の場合、ルールを@mediaブロックで置き換える
        if (nonHoverSelectors.length > 0) {
          const hoverRule = rule.clone();
          rule.selectors = nonHoverSelectors;
          hoverRule.selectors = hoverSelectors;
          rule.parent.insertBefore(rule, atRule);
          atRule.append(hoverRule);
        } else {
          rule.replaceWith(atRule);
          atRule.append(rule);
        }
      });
    },
  };
};
