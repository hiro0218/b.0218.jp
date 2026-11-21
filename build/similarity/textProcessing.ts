import type { Tokenizer } from 'kuromojin';
import type { Post } from '@/types/source';
import { tokenizeMeaningfulText } from '../shared/morphology';

const CONTENT_MAX_LENGTH = 7000;
const TITLE_WEIGHT = 3;
const HTML_TAG_PATTERN = /<[^>]*>/g;

export function extractTextFromPost(post: Post): string {
  const titleRepeated = post.title ? `${post.title} `.repeat(TITLE_WEIGHT) : '';
  // タグを除いてから 7000 文字を切り出さない。トークン化する本文が増え、類似度計算が遅くなるため
  const contentSnippet = post.content
    ? post.content.substring(0, CONTENT_MAX_LENGTH).replace(HTML_TAG_PATTERN, ' ')
    : '';
  return titleRepeated + contentSnippet;
}

export function preprocessText(text: string, tokenizerInstance: Tokenizer): string[] {
  if (!text) {
    return [];
  }

  return tokenizeMeaningfulText(text.normalize('NFKC'), tokenizerInstance);
}
