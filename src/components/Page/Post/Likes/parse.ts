import { isObject } from '@/lib/utils/isObject';

export type Like = {
  id: string;
  url: string;
  authorName: string;
  authorUrl: string | null;
  authorPhoto: string | null;
};

const LIKE_PROPERTY = 'like-of';
const DEFAULT_AUTHOR_NAME = '匿名';

function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asHttpUrl(value: unknown): string | null {
  const url = asNonEmptyString(value);
  if (!url) return null;
  return url.startsWith('https://') || url.startsWith('http://') ? url : null;
}

function asHttpsUrl(value: unknown): string | null {
  const url = asNonEmptyString(value);
  return url?.startsWith('https://') ? url : null;
}

function parseLike(value: unknown): Like | null {
  if (!isObject(value)) return null;
  if (value['wm-private'] === true) return null;
  if (value['wm-property'] !== LIKE_PROPERTY) return null;

  const url = asHttpUrl(value.url);
  if (!url) return null;

  const author = isObject(value.author) ? value.author : null;
  const wmId = value['wm-id'];
  const id = wmId == null ? url : String(wmId);

  return {
    id,
    url,
    authorName: asNonEmptyString(author?.name) ?? DEFAULT_AUTHOR_NAME,
    authorUrl: asHttpUrl(author?.url),
    authorPhoto: asHttpsUrl(author?.photo),
  };
}

/**
 * webmention.io の mentions.jf2 応答から like-of だけを取り出す
 */
export function parseLikes(input: unknown): Like[] {
  if (!isObject(input) || !Array.isArray(input.children)) return [];

  const likes: Like[] = [];
  for (const child of input.children) {
    const like = parseLike(child);
    if (like) likes.push(like);
  }

  return likes;
}
