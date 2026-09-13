import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AUTHOR_NAME, SITE_URL } from '@/constants';
import { PostLikes } from './Likes';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const TARGET_URL = `${SITE_URL}/example.html`;
const MENTION_URL = `${SITE_URL}/reply.html`;
const AUTHOR_URL = `${SITE_URL}/`;

function mockFetchJson(payload: unknown, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    json: async () => payload,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function flushFetch(fetchMock: ReturnType<typeof vi.fn>) {
  await act(async () => {
    await Promise.resolve(fetchMock.mock.results[0]?.value).catch(() => {});
    await Promise.resolve();
  });
}

describe('PostLikes', () => {
  it('いいねが無い場合、何も描画しない', async () => {
    const fetchMock = mockFetchJson({ type: 'feed', children: [] });
    const { container } = render(<PostLikes url={TARGET_URL} />);

    await flushFetch(fetchMock);

    expect(container.firstChild).toBeNull();
  });

  it('like-of がある場合、いいねとして著者を描画する', async () => {
    mockFetchJson({
      type: 'feed',
      children: [
        {
          url: MENTION_URL,
          'wm-id': 1,
          'wm-property': 'like-of',
          published: '2024-01-02T00:00:00Z',
          author: { name: AUTHOR_NAME, url: AUTHOR_URL },
        },
      ],
    });

    render(<PostLikes url={TARGET_URL} />);

    expect(await screen.findByRole('heading', { name: '1 Like' })).not.toBeNull();
    expect(screen.getByRole('link', { name: `${AUTHOR_NAME}のいいね` })).not.toBeNull();
    expect(screen.queryByText('参考になりました')).toBeNull();
  });

  it('いいねが複数ある場合、件数を Likes と表示する', async () => {
    mockFetchJson({
      type: 'feed',
      children: [
        {
          url: MENTION_URL,
          'wm-id': 1,
          'wm-property': 'like-of',
          author: { name: AUTHOR_NAME, url: AUTHOR_URL },
        },
        {
          url: `${SITE_URL}/other.html`,
          'wm-id': 2,
          'wm-property': 'like-of',
          author: { name: 'guest', url: AUTHOR_URL },
        },
      ],
    });

    render(<PostLikes url={TARGET_URL} />);

    expect(await screen.findByRole('heading', { name: '2 Likes' })).not.toBeNull();
  });

  it('返信だけの場合、何も描画しない', async () => {
    const fetchMock = mockFetchJson({
      type: 'feed',
      children: [
        {
          url: MENTION_URL,
          'wm-id': 1,
          'wm-property': 'in-reply-to',
          author: { name: AUTHOR_NAME, url: AUTHOR_URL },
          content: { text: '参考になりました' },
        },
      ],
    });
    const { container } = render(<PostLikes url={TARGET_URL} />);

    await flushFetch(fetchMock);

    expect(container.firstChild).toBeNull();
  });

  it('取得に失敗した場合、何も描画しない', async () => {
    const fetchMock = mockFetchJson({}, false);
    const { container } = render(<PostLikes url={TARGET_URL} />);

    await flushFetch(fetchMock);

    expect(container.firstChild).toBeNull();
  });

  it('fetch が例外を投げた場合、何も描画しない', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);
    const { container } = render(<PostLikes url={TARGET_URL} />);

    await flushFetch(fetchMock);

    expect(container.firstChild).toBeNull();
  });

  it('アンマウント時に fetch を中断する', () => {
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = render(<PostLikes url={TARGET_URL} />);
    const signal = fetchMock.mock.calls[0]?.[1]?.signal as AbortSignal;
    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });
});
