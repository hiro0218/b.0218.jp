import { tagKey } from '@/lib/tag/key';

export interface SearchDataItem {
  slug: string;
  title: string;
  tags: string[];
}

export type SearchIndex = Record<string, number[]>;

export type SearchDataPayload = {
  searchIndex: SearchIndex;
  searchData: SearchDataItem[];
};

export function normalizeSearchToken(value: string): string {
  return tagKey(value).trim();
}
