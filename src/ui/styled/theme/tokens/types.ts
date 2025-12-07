import type { Token, TokenDataTypes } from '@pandacss/types';

/**
 * トークンカテゴリに基づいて適切な Token 型を生成するユーティリティ型
 * @template T - TokenDataTypes のキー（'radii', 'colors', 'spacing' など）
 */
export type TokenValues<T extends keyof TokenDataTypes> = Record<string, Token<TokenDataTypes[T]>>;
