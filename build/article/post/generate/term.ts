import { tagKey } from '@/lib/tag/key';
import type { Post } from '@/types/source';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import { getPath } from './utils';

const PATH = getPath();

export async function buildTerm(posts: Post[]): Promise<void> {
  // タグの正規化キーごとに、代表表記とslugを管理する。
  // posts は buildPost() で正規化済み（同一 tagKey のタグは全記事で同一表記に統一済み。
  // post.ts の buildTagNormalizationMap + normalizeTags 参照）である前提であり、
  // この前提により表記ゆれの多数決は不要で、初出表記＝正規化済み表記になる。
  // 未正規化の posts を渡す新しい呼び出し元を作る場合は正規化を先に通すこと
  // （現在の呼び出し元は build/article/index.ts の 1 箇所のみ）。
  const tagGroups = new Map<
    string,
    {
      tag: string;
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
      const normalizedKey = tagKey(tag);
      let entry = tagGroups.get(normalizedKey);

      if (!entry) {
        entry = {
          tag,
          slugs: new Set<string>(),
        };
        tagGroups.set(normalizedKey, entry);
      }

      entry.slugs.add(slug);
    }
  }

  const tagsMap: {
    [key: string]: string[];
  } = {};

  for (const entry of tagGroups.values()) {
    tagsMap[entry.tag] = Array.from(entry.slugs);
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

  await writeJSON(`${PATH.to}/tags-with-count.json`, tagsWithCount);
  Log.info('Write dist/tags-with-count.json');
}
