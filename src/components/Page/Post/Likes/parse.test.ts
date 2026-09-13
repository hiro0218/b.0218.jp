import { describe, expect, it } from 'vitest';
import { AUTHOR_ICON, AUTHOR_NAME, SITE_URL } from '@/constants';
import { parseLikes } from './parse';

const AUTHOR_URL = `${SITE_URL}/`;
const MENTION_URL = `${SITE_URL}/reply.html`;

const VALID_ENTRY = {
  type: 'entry',
  author: {
    type: 'card',
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    photo: AUTHOR_ICON,
  },
  url: MENTION_URL,
  published: '2013-04-22T15:03:00-07:00',
  'wm-received': '2013-04-25T17:09:33-07:00',
  'wm-id': 900,
  content: {
    text: 'Another milestone',
    html: '<script>alert(1)</script>Another milestone',
  },
  'wm-property': 'like-of',
  'wm-private': false,
};

describe('parseLikes', () => {
  it('children が無い場合、空配列を返す', () => {
    expect(parseLikes(null)).toEqual([]);
    expect(parseLikes({})).toEqual([]);
    expect(parseLikes({ children: 'nope' })).toEqual([]);
  });

  it('like-of を Like に正規化する', () => {
    // toEqual は完全一致のため、VALID_ENTRY の content（XSS を試す html を含む）が
    // 結果に混入していないことも同時に検証している。
    expect(parseLikes({ children: [VALID_ENTRY] })).toEqual([
      {
        id: '900',
        url: MENTION_URL,
        authorName: AUTHOR_NAME,
        authorUrl: AUTHOR_URL,
        authorPhoto: AUTHOR_ICON,
      },
    ]);
  });

  it('like-of 以外の wm-property は除外する', () => {
    expect(parseLikes({ children: [{ ...VALID_ENTRY, 'wm-property': 'in-reply-to' }] })).toEqual([]);
    expect(parseLikes({ children: [{ ...VALID_ENTRY, 'wm-property': 'mention-of' }] })).toEqual([]);
    expect(parseLikes({ children: [{ ...VALID_ENTRY, 'wm-property': 'unknown' }] })).toEqual([]);
  });

  it('wm-private が true の場合、除外する', () => {
    expect(parseLikes({ children: [{ ...VALID_ENTRY, 'wm-private': true }] })).toEqual([]);
  });

  it('url が http(s) でない場合、除外する', () => {
    expect(parseLikes({ children: [{ ...VALID_ENTRY, url: 'javascript:alert(1)' }] })).toEqual([]);
    expect(parseLikes({ children: [{ ...VALID_ENTRY, url: '/relative' }] })).toEqual([]);
  });

  it('author.photo が https でない場合、photo を落とす', () => {
    const [like] = parseLikes({
      children: [
        { ...VALID_ENTRY, author: { ...VALID_ENTRY.author, photo: AUTHOR_ICON.replace('https://', 'http://') } },
      ],
    });
    expect(like?.authorPhoto).toBeNull();
  });

  it('著者名が無い場合、匿名にする', () => {
    const [like] = parseLikes({ children: [{ ...VALID_ENTRY, author: {} }] });
    expect(like?.authorName).toBe('匿名');
  });
});
