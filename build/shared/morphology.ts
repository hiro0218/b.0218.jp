import { type KuromojiToken, getTokenizer as loadTokenizer, type Tokenizer } from 'kuromojin';

const REGEX_DIGIT_ONLY = /^\d+$/;
const MEANINGFUL_POS: ReadonlySet<string> = new Set(['名詞', '動詞', '形容詞', '副詞']);
const EXCLUDED_POS_DETAIL: ReadonlySet<string> = new Set(['数', '接尾']);

/**
 * 日本語ストップワード
 * @description
 * 形態素解析時に除外する日本語の助詞・助動詞・接続詞など検索インデックスおよび類似度計算で使用
 */
const STOP_WORDS_JA = new Set([
  // 助詞
  'の',
  'に',
  'は',
  'を',
  'が',
  'で',
  'て',
  'と',
  'へ',
  'か',
  'も',
  'な',
  // 助動詞・活用語尾
  'た',
  'し',
  'れ',
  'さ',
  'だ',
  'ます',
  'です',
  'ない',
  'なり',
  'なら',
  'なる',
  'られ',
  // 動詞・補助動詞
  'ある',
  'いる',
  'する',
  'いう',
  'あり',
  // 指示詞
  'この',
  'その',
  'あの',
  'これ',
  'それ',
  'あれ',
  'これら',
  // 形式名詞・副詞
  'こと',
  'もの',
  'ため',
  'よう',
  'とき',
  '場合',
  // 接続詞・接続助詞
  'から',
  'また',
  'まで',
  'という',
  'として',
  'そして',
  'について',
  'および',
  'ならびに',
  // 接尾辞
  '的',
  '数',
]);

export function getTokenizer(): Promise<Tokenizer> {
  // 直近 1000 件のトークン保持を使わない。記事ごとに別のテキストを 1 度だけ解析するので、保持してもメモリが増えるだけ
  return loadTokenizer({ noCacheTokenize: true });
}

export function isMeaningfulToken(token: KuromojiToken): boolean {
  if (!MEANINGFUL_POS.has(token.pos)) return false;
  if (token.pos_detail_1 && EXCLUDED_POS_DETAIL.has(token.pos_detail_1)) return false;
  if (STOP_WORDS_JA.has(token.basic_form)) return false;
  if (token.basic_form.length <= 1) return false;
  if (REGEX_DIGIT_ONLY.test(token.basic_form)) return false;

  return true;
}

export function tokenizeMeaningfulText(text: string, tokenizerInstance: Tokenizer): string[] {
  if (!text) {
    return [];
  }

  // tokenizeForSentence にしない。全文を 1 つとして解析すると「。」の後の語の解析が変わり（なぜなら が なぜ と なら に割れる）、
  // 記事のトークン列と関連記事のスコアが動く。非推奨の tokenize だけが「、」「。」で区切って解析する
  return tokenizerInstance.tokenize(text).flatMap((token) => (isMeaningfulToken(token) ? [token.basic_form] : []));
}
