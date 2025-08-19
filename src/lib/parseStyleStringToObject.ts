import type { CSSProperties } from 'react';

const KEBAB_CASE_REGEX = /-([a-z])/g;

/**
 * 文字列形式のスタイルをReactのスタイルオブジェクトに変換する
 * @param styleString - CSSスタイルを表す文字列（例: "width: 100px; height: 200px;"）
 * @returns Reactのスタイルオブジェクト
 */
export const parseStyleStringToObject = (styleString: string): CSSProperties => {
  // 早期リターンの条件を簡潔に
  if (!styleString) return {};

  const styleObj: CSSProperties = {};
  const stylePairs = styleString.split(';');

  for (let i = 0; i < stylePairs.length; i++) {
    const stylePair = stylePairs[i];
    if (!stylePair) continue;

    // 最初のコロンだけで分割し、値に含まれるコロンは保持する
    const colonIndex = stylePair.indexOf(':');
    if (colonIndex === -1) continue;

    const rawKey = stylePair.slice(0, colonIndex).trim();
    const value = stylePair.slice(colonIndex + 1).trim();

    if (!rawKey || !value) continue;

    // ケバブケース（例：background-color）をキャメルケース（例：backgroundColor）に変換
    // ただし、CSS変数（--で始まる）の場合はそのままの形式を保持する
    const key = rawKey.startsWith('--')
      ? rawKey
      : rawKey.replace(KEBAB_CASE_REGEX, (_, group1) => group1.toUpperCase());

    styleObj[key] = value;
  }

  return styleObj;
};
