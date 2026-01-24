import type { Post } from '@/types/source';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { getPath } from './utils';

const PATH = getPath();

export async function buildTerm(posts: Partial<Post>[]) {
  // タグの正規化キーごとに、表記バリエーションとslugを管理
  const tagVariants = new Map<
    string,
    {
      variants: Map<string, number>;
      slugs: Set<string>;
    }
  >();

  // 各記事のタグを処理
  for (const post of posts) {
    const { slug, tags } = post;

    if (!slug || !tags) {
      continue;
    }

    for (const tag of tags) {
      const normalizedKey = tag.toLowerCase();
      let entry = tagVariants.get(normalizedKey);

      if (!entry) {
        entry = {
          variants: new Map<string, number>(),
          slugs: new Set<string>(),
        };
        tagVariants.set(normalizedKey, entry);
      }

      // 表記の出現回数をカウント
      entry.variants.set(tag, (entry.variants.get(tag) || 0) + 1);
      entry.slugs.add(slug);
    }
  }

  // 最頻出表記を選択してマップを構築
  const tagsMap: {
    [key: string]: string[];
  } = {};

  for (const [_normalizedKey, entry] of tagVariants) {
    // 最も出現回数が多い表記を選択
    const mostFrequentTag = Array.from(entry.variants.entries()).sort((a, b) => {
      // 出現回数で降順ソート
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      // 同数の場合は辞書順（アルファベット順）
      return a[0].localeCompare(b[0]);
    })[0][0];

    tagsMap[mostFrequentTag] = Array.from(entry.slugs);
  }

  await writeJSON(`${PATH.to}/tags.json`, tagsMap);
  Log.info('Write dist/tags.json');

  const tagsWithCount = Object.entries(tagsMap)
    .map(([slug, val]) => {
      return {
        slug: slug,
        count: val.length,
      };
    })
    .sort((a, b) => b.count - a.count); // 件数の多い順にソート

  await writeJSON(`${PATH.to}/tags-with-count.json`, [...tagsWithCount]);
  Log.info('Write dist/tags-with-count.json');
}
