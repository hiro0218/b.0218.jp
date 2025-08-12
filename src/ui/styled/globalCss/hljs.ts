import { defineGlobalStyles } from '@pandacss/dev';
import { blue, gray, green, orange, pink, purple, red, sky, teal, yellow } from '@radix-ui/colors';

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
    [`--${PREFIX}-purple`]: purple.purple11,
    [`--${PREFIX}-red`]: red.red11,
    [`--${PREFIX}-yellow`]: yellow.yellow11,
    [`--${PREFIX}-sky`]: sky.sky11,
    [`--${PREFIX}-teal`]: teal.teal11,
    [`--${PREFIX}-pink`]: pink.pink11,
    [`--${PREFIX}-green`]: green.green11,
    [`--${PREFIX}-blue`]: blue.blue11,
    [`--${PREFIX}-orange`]: orange.orange11,
    [`--${PREFIX}-gray11`]: gray.gray11,
    [`--${PREFIX}-gray10`]: gray.gray10,
    [`--${PREFIX}-gray9`]: gray.gray9,
    [`--${PREFIX}-gray8`]: gray.gray8,

    // styles
    ...applyHighlights(),
  },
});
