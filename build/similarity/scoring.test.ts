import { describe, expect, it } from 'vitest';
import {
  calculateBm25Idf,
  calculateDocFrequency,
  calculateIdfWeightedJaccard,
  calculateSublinearTf,
  filterRareTerms,
} from './scoring';

describe('calculateSublinearTf', () => {
  it('空配列の場合、空オブジェクトを返す', () => {
    const result = calculateSublinearTf([]);
    expect(result).toEqual({});
  });

  it('単一出現のタームに対して 1 + log(1) = 1 を返す', () => {
    const result = calculateSublinearTf(['react']);
    expect(result.react).toBeCloseTo(1, 5);
  });

  it('複数出現のタームに対してサブリニア TF を返す', () => {
    // 'react' が 3 回出現 → 1 + log(3) ≈ 2.0986
    const result = calculateSublinearTf(['react', 'next', 'react', 'react']);
    expect(result.react).toBeCloseTo(1 + Math.log(3), 5);
    expect(result.next).toBeCloseTo(1, 5);
  });

  it('線形 TF より高頻度語の重みが抑制されること', () => {
    // 10回出現: サブリニア TF = 1 + log(10) ≈ 3.3026
    // 線形 TF だと 10/11 ≈ 0.909（相対的に高い）
    const words = Array(10).fill('react').concat(['next']);
    const result = calculateSublinearTf(words);

    // 10回出現のタームが1回出現の10倍にならないことを確認
    expect(result.react / result.next).toBeLessThan(10);
    expect(result.react).toBeCloseTo(1 + Math.log(10), 5);
  });
});

describe('calculateBm25Idf', () => {
  it('全文書に出現するタームの IDF が低くなること', () => {
    const docFrequency = { common: 100, rare: 2 };
    const result = calculateBm25Idf(100, docFrequency);

    expect(result.rare).toBeGreaterThan(result.common);
  });

  it('BM25 IDF の計算式が正しいこと', () => {
    // N=10, df=3 → log((10 - 3 + 0.5) / (3 + 0.5) + 1) = log(7.5/3.5 + 1) = log(3.1429)
    const result = calculateBm25Idf(10, { term: 3 });
    const expected = Math.log((10 - 3 + 0.5) / (3 + 0.5) + 1);
    expect(result.term).toBeCloseTo(expected, 5);
  });

  it('df が 0 のタームに対して最大の IDF を返す', () => {
    const result = calculateBm25Idf(10, { rare: 0, common: 10 });
    expect(result.rare).toBeGreaterThan(result.common);
  });
});

describe('filterRareTerms', () => {
  it('df < 2 のタームを除外すること', () => {
    const docFrequency = { rare: 1, common: 5, medium: 2 };
    const result = filterRareTerms(docFrequency);

    expect(result.rare).toBeUndefined();
    expect(result.common).toBe(5);
    expect(result.medium).toBe(2);
  });

  it('全タームが df >= 2 の場合、全て残ること', () => {
    const docFrequency = { a: 2, b: 3, c: 10 };
    const result = filterRareTerms(docFrequency);

    expect(Object.keys(result).length).toBe(3);
  });

  it('全タームが df < 2 の場合、空オブジェクトを返す', () => {
    const docFrequency = { a: 1, b: 1 };
    const result = filterRareTerms(docFrequency);

    expect(result).toEqual({});
  });
});

describe('calculateDocFrequency', () => {
  it('各タームの文書頻度を正しく計算すること', () => {
    const contents = [
      ['react', 'next', 'react'], // react は同一文書内で重複 → df=1
      ['react', 'vue'],
      ['next', 'vue'],
    ];
    const result = calculateDocFrequency(contents);

    expect(result.react).toBe(2); // 文書1, 文書2
    expect(result.next).toBe(2); // 文書1, 文書3
    expect(result.vue).toBe(2); // 文書2, 文書3
  });

  it('空配列の場合、空オブジェクトを返す', () => {
    const result = calculateDocFrequency([]);
    expect(result).toEqual({});
  });

  it('空の文書が混在しても正しく計算すること', () => {
    const contents = [['react'], [], ['react', 'next']];
    const result = calculateDocFrequency(contents);

    expect(result.react).toBe(2);
    expect(result.next).toBe(1);
  });
});

describe('calculateIdfWeightedJaccard', () => {
  it('完全一致のタグセットの場合、1.0 を返す', () => {
    const tagIdf = { react: 2.0, next: 1.5 };
    const result = calculateIdfWeightedJaccard(['react', 'next'], ['react', 'next'], tagIdf);
    expect(result).toBeCloseTo(1.0, 5);
  });

  it('共通タグがない場合、0 を返す', () => {
    const tagIdf = { react: 2.0, vue: 1.5 };
    const result = calculateIdfWeightedJaccard(['react'], ['vue'], tagIdf);
    expect(result).toBeCloseTo(0, 5);
  });

  it('片方が空配列の場合、0 を返す', () => {
    const tagIdf = { react: 2.0 };
    expect(calculateIdfWeightedJaccard([], ['react'], tagIdf)).toBe(0);
    expect(calculateIdfWeightedJaccard(['react'], [], tagIdf)).toBe(0);
  });

  it('IDF が高いタグの共通が重み付けに反映されること', () => {
    // rare タグ (IDF=5.0) が共通 vs common タグ (IDF=0.5) が共通
    const tagIdf = { rare: 5.0, common: 0.5, other: 1.0 };

    // rare が共通: numerator=5.0, denominator=5.0+1.0=6.0 → 5/6=0.833
    const resultRare = calculateIdfWeightedJaccard(['rare', 'other'], ['rare'], tagIdf);

    // common が共通: numerator=0.5, denominator=0.5+1.0=1.5 → 0.5/1.5=0.333
    const resultCommon = calculateIdfWeightedJaccard(['common', 'other'], ['common'], tagIdf);

    expect(resultRare).toBeGreaterThan(resultCommon);
  });

  it('IDF スコアが 0 のタグは無視されること', () => {
    const tagIdf = { react: 2.0 };
    // 'unknown' は tagIdf に存在しないので IDF=0、無視される
    const result = calculateIdfWeightedJaccard(['react', 'unknown'], ['react'], tagIdf);
    // numerator=2.0, denominator=2.0 → 1.0
    expect(result).toBeCloseTo(1.0, 5);
  });
});
