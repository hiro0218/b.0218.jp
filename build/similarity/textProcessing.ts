import kuromoji, { type IpadicFeatures, type Tokenizer } from 'kuromoji';
import type { Post } from '@/types/source';
import { STOP_WORDS_JA } from '../shared/stopWords';

const REGEX_DIGIT_ONLY = /^\d+$/;
const CONTENT_MAX_LENGTH = 7000;
const TITLE_WEIGHT = 3;

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

export async function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      const builder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });

      const timeout = setTimeout(() => {
        reject(new Error('形態素解析器の初期化がタイムアウトしました（60秒）'));
      }, 60000);

      builder.build((err, tokenizer) => {
        clearTimeout(timeout);

        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  }

  try {
    return await tokenizerPromise;
  } catch (error) {
    console.error('[build/similarity/textProcessing] 形態素解析器の初期化に失敗:', error);
    throw error;
  }
}

export function extractTextFromPost(post: Post): string {
  const titleRepeated = post.title ? `${post.title} `.repeat(TITLE_WEIGHT) : '';
  const contentSnippet = post.content ? post.content.substring(0, CONTENT_MAX_LENGTH) : '';
  return titleRepeated + contentSnippet;
}

function isMeaningfulToken(token: IpadicFeatures): boolean {
  const validPos = ['名詞', '動詞', '形容詞', '副詞'];
  if (!validPos.includes(token.pos)) return false;

  if (token.pos_detail_1?.includes('数') || token.pos_detail_1?.includes('接尾')) return false;
  if (token.pos === '記号') return false;
  if (STOP_WORDS_JA.has(token.basic_form)) return false;
  if (token.basic_form.length <= 1) return false;
  if (REGEX_DIGIT_ONLY.test(token.basic_form)) return false;

  return true;
}

export function preprocessText(text: string, tokenizerInstance: Tokenizer<IpadicFeatures>, slug?: string): string[] {
  if (!text) {
    return [];
  }

  try {
    const normalizedText = text.normalize('NFKC');
    const tokens: IpadicFeatures[] = tokenizerInstance.tokenize(normalizedText);
    const meaningfulTokens: string[] = [];

    for (const token of tokens) {
      if (isMeaningfulToken(token)) {
        meaningfulTokens.push(token.basic_form);
      }
    }

    return meaningfulTokens;
  } catch (error) {
    console.error(
      `[build/similarity/textProcessing] テキスト前処理中にエラー${slug ? ` (記事: ${slug})` : ''}:`,
      error,
    );
    throw error;
  }
}
