import kuromoji, { type IpadicFeatures, type Tokenizer } from 'kuromoji';
import * as Log from '~/tools/logger';
import { STOP_WORDS_JA } from '../shared/stopWords';

const REGEX_DIGIT_ONLY = /^\d+$/;

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

/**
 * 形態素解析器を初期化する（シングルトン）
 */
export async function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      const builder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });
      builder.build((err, tokenizer) => {
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
    tokenizerPromise = null;
    Log.error('[build/search/tokenizer] 形態素解析器の初期化に失敗:', String(error));
    throw error;
  }
}

/**
 * テキストを形態素解析し、意味のある単語の基本形配列を返す
 *
 * @param text 解析対象のテキスト
 * @param tokenizerInstance トークナイザインスタンス
 * @returns 意味のある単語の配列（基本形）
 */
export function tokenizeText(text: string, tokenizerInstance: Tokenizer<IpadicFeatures>): string[] {
  if (!text) {
    return [];
  }

  try {
    const tokens: IpadicFeatures[] = tokenizerInstance.tokenize(text);
    const meaningfulTokens: string[] = [];

    for (const token of tokens) {
      if (token.pos === '名詞' || token.pos === '動詞' || token.pos === '形容詞' || token.pos === '副詞') {
        if (token.pos_detail_1 && (token.pos_detail_1.includes('数') || token.pos_detail_1.includes('接尾'))) {
          continue;
        }
        if (STOP_WORDS_JA.has(token.basic_form) || token.basic_form.length <= 1) {
          continue;
        }
        if (REGEX_DIGIT_ONLY.test(token.basic_form)) {
          continue;
        }
        meaningfulTokens.push(token.basic_form);
      }
    }
    return meaningfulTokens;
  } catch (error) {
    Log.error('[build/search/tokenizer] テキスト前処理中にエラー:', String(error));
    throw error;
  }
}
