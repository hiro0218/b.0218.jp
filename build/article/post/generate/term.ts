import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import type { Post } from '@/types/source';
import { getPath } from './utils';

const PATH = getPath();

export async function buildTerm(posts: Partial<Post>[]) {
  // タグごとに記事slugを集める
  const tagsMapWithSet = new Map<string, Set<string>>();

  for (const post of posts) {
    const { slug, tags } = post;

    if (!slug || !tags) {
      continue;
    }

    for (const tag of tags) {
      let slugs = tagsMapWithSet.get(tag);

      if (!slugs) {
        slugs = new Set<string>();
        tagsMapWithSet.set(tag, slugs);
      }

      slugs.add(slug);
    }
  }

  // 出力用のオブジェクトに変換
  const tagsMap: {
    [key: string]: string[];
  } = {};

  for (const [tag, slugs] of tagsMapWithSet) {
    tagsMap[tag] = Array.from(slugs);
  }

  writeJSON(`${PATH.to}/tags.json`, tagsMap).then(() => {
    Log.info('Write dist/tags.json');
  });

  const tagsWithCount = Object.entries(tagsMap)
    .map(([slug, val]) => {
      return {
        slug: slug,
        count: val.length,
      };
    })
    .sort((a, b) => b.count - a.count); // 件数の多い順にソート

  writeJSON(`${PATH.to}/tags-with-count.json`, [...tagsWithCount]).then(() => {
    Log.info('Write dist/tags-with-count.json');
  });
}
