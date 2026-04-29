import { isObject } from '@/lib/utils/isObject';
import type { Page } from '@/types/source';
import pagesData from '~/dist/pages.json';
import { createEagerSource } from './internal/eagerSource';

function isPage(value: unknown): value is Page {
  if (!isObject(value)) return false;
  return (
    typeof value.title === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.date === 'string' &&
    typeof value.content === 'string'
  );
}

function isPageArray(value: unknown): value is Page[] {
  return Array.isArray(value) && value.every(isPage);
}

const pagesSource = createEagerSource<Page[]>({
  data: pagesData,
  validate: isPageArray,
  label: 'pages',
});

/** 固定ページ (about / privacy 等、Post と区別される非記事) を取得する。 */
export function getPagesJson(): Page[] {
  return pagesSource.get();
}
