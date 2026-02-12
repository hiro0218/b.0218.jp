import type { RehypeShikiOptions } from '@shikijs/rehype';

import { collectText } from './hastUtils';

export const shikiConfig: RehypeShikiOptions = {
  themes: {
    light: 'one-light',
    dark: 'one-dark-pro',
  },
  defaultColor: false,
  transformers: [
    {
      name: 'add-language-attribute',
      code(node) {
        const lang = this.options.lang;
        if (lang) {
          node.properties['data-language'] = lang;
        }
      },
    },
    {
      name: 'diff-line-highlight',
      line(node) {
        if (this.options.lang !== 'diff') return;
        const text = collectText(node.children);
        if (text.startsWith('+')) {
          node.properties['data-diff'] = 'add';
        } else if (text.startsWith('-')) {
          node.properties['data-diff'] = 'remove';
        }
      },
    },
  ],
};
