import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import type { Post } from '@/types/source';
import { tokenizeMeaningfulText } from '../shared/morphology';

const CONTENT_MAX_LENGTH = 7000;
const TITLE_WEIGHT = 3;

export function extractTextFromPost(post: Post): string {
  const titleRepeated = post.title ? `${post.title} `.repeat(TITLE_WEIGHT) : '';
  const contentSnippet = post.content ? post.content.substring(0, CONTENT_MAX_LENGTH) : '';
  return titleRepeated + contentSnippet;
}

export function preprocessText(text: string, tokenizerInstance: Tokenizer<IpadicFeatures>): string[] {
  if (!text) {
    return [];
  }

  return tokenizeMeaningfulText(text.normalize('NFKC'), tokenizerInstance);
}
