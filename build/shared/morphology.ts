import kuromoji, { type IpadicFeatures, type Tokenizer } from 'kuromoji';
import { STOP_WORDS_JA } from './stopWords';

const TOKENIZER_DIC_PATH = 'node_modules/kuromoji/dict';
const TOKENIZER_INIT_TIMEOUT_MS = 60_000;
const REGEX_DIGIT_ONLY = /^\d+$/;
const MEANINGFUL_POS: ReadonlySet<string> = new Set(['名詞', '動詞', '形容詞', '副詞']);
const EXCLUDED_POS_DETAIL: ReadonlySet<string> = new Set(['数', '接尾']);

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

function createTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  return new Promise((resolve, reject) => {
    const builder = kuromoji.builder({ dicPath: TOKENIZER_DIC_PATH });
    const timeout = setTimeout(() => {
      reject(new Error('形態素解析器の初期化がタイムアウトしました（60秒）'));
    }, TOKENIZER_INIT_TIMEOUT_MS);

    builder.build((err, tokenizer) => {
      clearTimeout(timeout);

      if (err) {
        reject(err);
        return;
      }

      resolve(tokenizer);
    });
  });
}

export async function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  if (!tokenizerPromise) {
    tokenizerPromise = createTokenizer();
  }

  try {
    return await tokenizerPromise;
  } catch (error) {
    tokenizerPromise = null;
    throw error;
  }
}

export function isMeaningfulToken(token: IpadicFeatures): boolean {
  if (!MEANINGFUL_POS.has(token.pos)) return false;
  if (token.pos_detail_1 && EXCLUDED_POS_DETAIL.has(token.pos_detail_1)) return false;
  if (STOP_WORDS_JA.has(token.basic_form)) return false;
  if (token.basic_form.length <= 1) return false;
  if (REGEX_DIGIT_ONLY.test(token.basic_form)) return false;

  return true;
}

export function tokenizeMeaningfulText(text: string, tokenizerInstance: Tokenizer<IpadicFeatures>): string[] {
  if (!text) {
    return [];
  }

  return tokenizerInstance.tokenize(text).flatMap((token) => (isMeaningfulToken(token) ? [token.basic_form] : []));
}
