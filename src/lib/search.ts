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
  // NFKC で全角英数 (`Ｒｅａｃｔ` など) を半角に統合してから tagKey で lowercase 化する
  return tagKey(value.normalize('NFKC')).trim();
}
