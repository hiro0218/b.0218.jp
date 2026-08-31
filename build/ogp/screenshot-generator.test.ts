import { describe, expect, it } from 'vitest';
import { selectPostsWithoutImages } from './screenshot-generator';

describe('selectPostsWithoutImages', () => {
  it('既存画像がない記事のみを返すこと', () => {
    const posts = [{ slug: 'a' }, { slug: 'b' }];
    const result = selectPostsWithoutImages(posts, ['a.jpg'], 'jpg');

    expect(result).toEqual([{ slug: 'b' }]);
  });

  it('全記事に既存画像がある場合、空配列を返すこと', () => {
    const posts = [{ slug: 'a' }, { slug: 'b' }];
    const result = selectPostsWithoutImages(posts, ['a.jpg', 'b.jpg'], 'jpg');

    expect(result).toEqual([]);
  });

  it('出力ディレクトリが空の場合、全記事を返すこと', () => {
    const posts = [{ slug: 'a' }, { slug: 'b' }];
    const result = selectPostsWithoutImages(posts, [], 'jpg');

    expect(result).toEqual(posts);
  });

  it('拡張子が一致しないファイルは既存画像として扱わないこと', () => {
    const posts = [{ slug: 'a' }];
    const result = selectPostsWithoutImages(posts, ['a.png'], 'jpg');

    expect(result).toEqual(posts);
  });

  it('無関係なファイルが混在していても既存画像の判定に影響しないこと', () => {
    const posts = [{ slug: 'a' }];
    const result = selectPostsWithoutImages(posts, ['.DS_Store', 'a.jpg'], 'jpg');

    expect(result).toEqual([]);
  });
});
