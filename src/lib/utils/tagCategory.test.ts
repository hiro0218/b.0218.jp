import type { TagCategoryMap } from '@/types/source';

import { getPrimaryCategory } from './tagCategory';

const categoryMap: TagCategoryMap = {
  react: 'development',
  typeScript: 'development',
  ai: 'technology',
  chatGpt: 'technology',
  misc: 'other',
};

describe('getPrimaryCategory', () => {
  it('空配列の場合、undefinedを返す', () => {
    expect(getPrimaryCategory([], categoryMap)).toBeUndefined();
  });

  it('undefinedの場合、undefinedを返す', () => {
    expect(getPrimaryCategory(undefined, categoryMap)).toBeUndefined();
  });

  it('マッチするタグがある場合、最初のマッチのカテゴリを返す', () => {
    expect(getPrimaryCategory(['react', 'ai'], categoryMap)).toBe('development');
  });

  it('マッチするタグがない場合、undefinedを返す', () => {
    expect(getPrimaryCategory(['unknown-tag', 'another'], categoryMap)).toBeUndefined();
  });

  it('未知タグと既知タグが混在する場合、既知タグのカテゴリを返す', () => {
    expect(getPrimaryCategory(['unknown', 'ai', 'react'], categoryMap)).toBe('technology');
  });
});
