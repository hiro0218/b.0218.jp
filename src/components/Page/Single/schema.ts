/**
 * 構造化データの共通定義
 */
import type { Person } from 'schema-dts';
import { AUTHOR_ICON, AUTHOR_NAME, SITE_URL, URL } from '@/constant';

export const AUTHOR: Person = {
  '@type': 'Person',
  name: AUTHOR_NAME,
  image: AUTHOR_ICON,
  url: SITE_URL,
  sameAs: [...Object.values(URL)],
  jobTitle: 'Frontend Developer',
} as const;
