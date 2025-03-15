import { getPostsJson } from '@/lib/posts';
import * as Log from '@/shared/Log';
import { mkdir, writeFile } from '@/shared/fs';
import { getPath } from './post/generate/utils';

const PATH = getPath();

const REGEX_CODE_TAG = /<\/?code\b[^>]*>/gi; // `<code>` または `</code>` を厳密に判定する正規表現

/**
 * titleとcontentの文字列を抽出し、<code>と</code>の間の文字を除外して重複しない文字のみを含む文字列を生成する関数
 * @returns 重複しない文字だけを含む文字列
 */
function extractUniqueChars(data: { title: string; content: string }[]): string {
  const uniqueCharsSet = new Set<string>();

  // 数字 (0-9): U+0030 - U+0039
  // addCharRange(0x0030, 0x0039, uniqueCharsSet);

  // 英大文字 (A-Z): U+0041 - U+005A
  // addCharRange(0x0041, 0x005A, uniqueCharsSet);

  // 英小文字 (a-z): U+0061 - U+007A
  // addCharRange(0x0061, 0x007A, uniqueCharsSet);

  // ASCII記号: U+0020 - U+002F, U+003A - U+0040, U+005B - U+0060, U+007B - U+007E
  // addCharRange(0x0021, 0x002F, uniqueCharsSet); // !"#$%&'()*+,-./
  // addCharRange(0x003A, 0x0040, uniqueCharsSet); // :;<=>?@
  // addCharRange(0x005B, 0x0060, uniqueCharsSet); // [\]^_`
  // addCharRange(0x007B, 0x007E, uniqueCharsSet); // {|}~

  // ひらがな: U+3041 - U+3096
  addCharRange(0x3041, 0x3096, uniqueCharsSet);

  // カタカナ: U+30A1 - U+30FA
  addCharRange(0x30a1, 0x30fa, uniqueCharsSet);

  // 全角英数記号（必要な場合）: U+FF01 - U+FF5E
  addCharRange(0xff01, 0xff5e, uniqueCharsSet);

  for (let i = 0; i < data.length; i++) {
    processStringAndAddToSet(data[i].title, uniqueCharsSet);
    processStringAndAddToSet(data[i].content, uniqueCharsSet);
  }

  return Array.from(uniqueCharsSet).join('');
}

/** 絵文字を判定する関数 */
const isEmoji = (char: string): boolean => /\p{Emoji}/u.test(char);

/** アルファベットやASCII記号判定する関数 */
const isAscii = (char: string): boolean => /^[\x20-\x7E]*$/.test(char);

/**
 * 指定されたコードポイント範囲の文字をSetに追加する補助関数
 * @param start - 開始コードポイント
 * @param end - 終了コードポイント
 * @param charSet - 文字を追加するSet
 */
function addCharRange(start: number, end: number, charSet: Set<string>): void {
  for (let codePoint = start; codePoint <= end; codePoint++) {
    const char = String.fromCodePoint(codePoint);
    charSet.add(char);
  }
}

/**
 * 文字列を処理し、<code>と</code>の間の文字を除外して残りの文字をSetに追加する補助関数
 * @param str - 処理する文字列
 * @param charSet - 文字を追加するSet
 */
function processStringAndAddToSet(str: string, charSet: Set<string>): void {
  let insideCodeTag = 0; // ネスト対応のためカウンタを使用
  let match;
  let lastIndex = 0;

  while ((match = REGEX_CODE_TAG.exec(str)) !== null) {
    // <code> までの部分を処理
    if (insideCodeTag === 0) {
      addCharactersToSet(str.substring(lastIndex, match.index), charSet);
    }

    // <code> の場合はカウント増加, </code> の場合は減少
    if (match[0].startsWith('</')) {
      insideCodeTag = Math.max(0, insideCodeTag - 1);
    } else {
      insideCodeTag += 1;
    }

    lastIndex = REGEX_CODE_TAG.lastIndex;
  }

  // 残りの文字列を処理
  if (insideCodeTag === 0) {
    addCharactersToSet(str.substring(lastIndex), charSet);
  }
}

/**
 * 文字列から個別の文字をSetに追加（大文字小文字を区別）
 * @param str - 追加する文字列
 * @param charSet - 文字を格納するSet
 */
function addCharactersToSet(str: string, charSet: Set<string>): void {
  for (const char of str) {
    if (!/\s/.test(char) && !isEmoji(char) && !isAscii(char)) {
      charSet.add(char); // 大文字小文字をそのまま維持
    }
  }
}

(async () => {
  const data = getPostsJson();
  const uniqueStrings = extractUniqueChars(data);
  const file = `export default ${JSON.stringify(uniqueStrings)};`;

  await mkdir(`${PATH.to}`, { recursive: true });
  writeFile(`${PATH.to}/uniqueChars.ts`, file).then(() => {
    Log.info(`Write dist/uniqueChars.ts`);
  });
})();
