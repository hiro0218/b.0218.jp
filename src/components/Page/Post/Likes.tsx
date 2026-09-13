'use client';

import { useEffect, useId, useState } from 'react';
import { Avatar, AvatarGroup } from '@/components/UI/Avatar/Avatar';
import { Heading } from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout/Stack';
import { WEBMENTION } from '@/constants';
import { type Like, parseLikes } from './Likes/parse';

type Props = {
  url: string;
};

/**
 * 記事へのいいね（like-of）を webmention.io から取得して表示
 * ビルド成果を動的にしないため、マウント後に取得し、0 件・失敗時は何も出さない
 * @summary 記事への Webmention いいね一覧
 */
export function PostLikes({ url }: Props) {
  const headingId = useId();
  const [likes, setLikes] = useState<Like[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchLikes(url, controller.signal)
      .then(setLikes)
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setLikes([]);
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  if (!likes || likes.length === 0) return null;

  return (
    <Stack aria-labelledby={headingId} as="section" gap={300}>
      <Heading as="h2" className="sr-only" id={headingId}>
        {formatLikesLabel(likes.length)}
      </Heading>
      <AvatarGroup>
        {likes.map((like) => (
          <Avatar key={like.id} name={like.authorName} src={like.authorPhoto} />
        ))}
      </AvatarGroup>
    </Stack>
  );
}

async function fetchLikes(targetUrl: string, signal: AbortSignal): Promise<Like[]> {
  const requestUrl = `${WEBMENTION.mentionsApi}?${new URLSearchParams({
    target: targetUrl,
    'wm-property': 'like-of',
    'per-page': '50',
  })}`;
  const response = await fetch(requestUrl, { signal });

  if (!response.ok) return [];

  return parseLikes(await response.json());
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function formatLikesLabel(count: number): string {
  return count === 1 ? '1 Like' : `${count} Likes`;
}
