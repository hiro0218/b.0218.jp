import type { CSSProperties } from 'react';

/**
 * 文字列形式のスタイルをReactのスタイルオブジェクトに変換する
 * @param styleString - CSSスタイルを表す文字列（例: "width: 100px; height: 200px;"）
 * @returns Reactのスタイルオブジェクト
 */
export const parseStyleStringToObject = (styleString: string): CSSProperties => {
  if (styleString === null || styleString === undefined || styleString === '') return {};

  return styleString
    .split(';')
    .filter(Boolean)
    .reduce((styleObj, stylePair) => {
      // 最初のコロンだけで分割し、値に含まれるコロンは保持する
      const colonIndex = stylePair.indexOf(':');
      if (colonIndex === -1) return styleObj;

      const rawKey = stylePair.slice(0, colonIndex).trim();
      const value = stylePair.slice(colonIndex + 1).trim();

      if (!rawKey || !value) return styleObj;

      // ケバブケース（例：background-color）をキャメルケース（例：backgroundColor）に変換
      // ただし、CSS変数（--で始まる）の場合はそのままの形式を保持する
      const key = rawKey.startsWith('--') ? rawKey : rawKey.replace(/-([a-z])/g, (_, group1) => group1.toUpperCase());

      return {
        ...styleObj,
        [key]: value,
      };
    }, {} as CSSProperties);
};
