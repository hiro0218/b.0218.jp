import type { Page } from '@/types/source';
import pagesData from '~/dist/pages.json';

let cachedPages: Page[] | undefined;

/** ページデータを取得 */
export const getPagesJson = (): Page[] => (cachedPages ??= pagesData as Page[]);
