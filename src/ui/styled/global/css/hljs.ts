import { defineGlobalStyles } from '@pandacss/dev';

type StyleProps<T> = {
  key: string;
  value: T;
};

const highlightValues = [
  'purple',
  'red',
  'yellow',
  'sky',
  'teal',
  'pink',
  'green',
  'blue',
  'gray11',
  'gray10',
  'gray9',
  'gray8',
  'orange',
] as const;

const fontStyleValues = ['italic', 'bold'] as const;

const highlights: StyleProps<(typeof highlightValues)[number]>[] = [
  { key: 'addition', value: 'green' },
  { key: 'attr', value: 'green' },
  { key: 'attribute', value: 'green' },
  { key: 'built_in', value: 'orange' },
  { key: 'bullet', value: 'blue' },
  { key: 'char.escape_', value: 'green' },
  { key: 'code', value: 'green' },
  { key: 'comment', value: 'gray10' },
  { key: 'deletion', value: 'red' },
  { key: 'doctag', value: 'red' },
  { key: 'emphasis', value: 'red' },
  { key: 'formula', value: 'teal' },
  { key: 'keyword', value: 'purple' },
  { key: 'link', value: 'blue' },
  { key: 'literal', value: 'orange' },
  { key: 'meta', value: 'pink' },
  { key: 'name', value: 'red' },
  { key: 'number', value: 'pink' },
  { key: 'operator', value: 'sky' },
  { key: 'params', value: 'green' },
  { key: 'property', value: 'teal' },
  { key: 'punctuation', value: 'gray10' },
  { key: 'quote', value: 'green' },
  { key: 'regexp', value: 'red' },
  { key: 'section', value: 'blue' },
  { key: 'selector-attr', value: 'purple' },
  { key: 'selector-class', value: 'red' },
  { key: 'selector-id', value: 'blue' },
  { key: 'selector-pseudo', value: 'purple' },
  { key: 'selector-tag', value: 'purple' },
  { key: 'string', value: 'green' },
  { key: 'strong', value: 'red' },
  { key: 'subst', value: 'gray9' },
  { key: 'symbol', value: 'green' },
  { key: 'tag', value: 'red' },
  { key: 'template-tag', value: 'red' },
  { key: 'template-variable', value: 'red' },
  { key: 'title', value: 'blue' },
  { key: 'title.class_', value: 'yellow' },
  { key: 'title.function_', value: 'blue' },
  { key: 'type', value: 'orange' },
  { key: 'variable', value: 'red' },
  { key: 'variable.constant_', value: 'pink' },
  { key: 'variable.language_', value: 'pink' },
] as const;

const fontStyles: StyleProps<(typeof fontStyleValues)[number]>[] = [
  { key: 'emphasis', value: 'italic' },
  { key: 'strong', value: 'bold' },
  { key: 'link', value: 'italic' },
  { key: 'quote', value: 'italic' },
] as const;

/** highlight.js class name */
const PREFIX = 'hljs';

function applyHighlights() {
  const highlightCss = {};
  const fontStyleCss = {};

  highlights.forEach((highlight) => {
    highlightCss[`.${PREFIX}-${highlight.key}`] = { color: `var(--${PREFIX}-${highlight.value})` };
  });

  fontStyles.forEach((fontStyle) => {
    fontStyleCss[`.${PREFIX}-${fontStyle.key}`] = { fontStyle: fontStyle.value };
  });

  return { ...highlightCss, ...fontStyleCss };
}

export const hljsCss = defineGlobalStyles({
  [`.${PREFIX}`]: {
    // variables
    [`--${PREFIX}-purple`]: '{colors.purple.1200}',
    [`--${PREFIX}-red`]: '{colors.red.1200}',
    [`--${PREFIX}-yellow`]: '{colors.yellow.1200}',
    [`--${PREFIX}-sky`]: '{colors.sky.1200}',
    [`--${PREFIX}-teal`]: '{colors.teal.1200}',
    [`--${PREFIX}-pink`]: '{colors.pink.1200}',
    [`--${PREFIX}-green`]: '{colors.green.1200}',
    [`--${PREFIX}-blue`]: '{colors.blue.1200}',
    [`--${PREFIX}-orange`]: '{colors.orange.1200}',
    [`--${PREFIX}-gray11`]: '{colors.gray.900}',
    [`--${PREFIX}-gray10`]: '{colors.gray.900}',
    [`--${PREFIX}-gray9`]: '{colors.gray.900}',
    [`--${PREFIX}-gray8`]: '{colors.gray.800}',

    // styles
    ...applyHighlights(),
  },
});
