import { writeJSON } from '@/shared/fs';
import * as Log from '@/shared/Log';
import type { PostProps } from '@/types/source';
import { getPath } from './utils';

const PATH = getPath();

export async function buildTerm(posts: Partial<PostProps>[]) {
  const tagsMap: {
    [key: string]: string[];
  } = {};

  for (let i = 0; i < posts.length; i++) {
    const { slug, tags } = posts[i];

    if (!slug || !tags) {
      continue;
    }

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const mappedTags = tagsMap[tag];

      if (mappedTags) {
        mappedTags.push(slug);
      } else {
        tagsMap[tag] = [slug];
      }
    }
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
