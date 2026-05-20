import type { Schema } from 'hast-util-sanitize';
import { defaultSchema } from 'rehype-sanitize';

// `alt` / `title` / `width` / `height` 等の汎用属性は defaultSchema.attributes['*'] に含まれる
// `'data*'` は hast-util-sanitize の特別指定で data-* 属性をすべて許可する (CodePen / Twitter 等の embed が依存)
export const sanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'figure', 'figcaption', 'caption', 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'data*'],
    a: [...(defaultSchema.attributes?.a ?? []), 'rel', 'target'],
    img: [...(defaultSchema.attributes?.img ?? []), 'loading'],
    iframe: [
      'src',
      'allow',
      'allowFullScreen',
      'allowTransparency',
      'frameBorder',
      'loading',
      'name',
      'referrerPolicy',
      'sandbox',
      'scrolling',
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), 'tel'],
  },
};
