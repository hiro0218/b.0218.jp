import { describe, expect, it } from 'vitest';
import type { RawPost } from './raw';
import { isPubliclyVisible } from './visibility';

const baseRaw: RawPost = {
  slug: 'x',
  content: '',
  title: 'x',
  date: '2025-01-01T00:00:00.000Z',
  tags: [],
};

describe('isPubliclyVisible', () => {
  it('現在より過去の投稿は表示する', () => {
    const ctx = { now: new Date('2025-06-01'), isContentPreview: false };
    expect(isPubliclyVisible(baseRaw, ctx)).toBe(true);
  });

  it('現在より未来の投稿は非表示にする', () => {
    const future = { ...baseRaw, date: '2026-01-01T00:00:00.000Z' };
    const ctx = { now: new Date('2025-06-01'), isContentPreview: false };
    expect(isPubliclyVisible(future, ctx)).toBe(false);
  });

  it('preview モードでは未来の投稿も表示する', () => {
    const future = { ...baseRaw, date: '2026-01-01T00:00:00.000Z' };
    const ctx = { now: new Date('2025-06-01'), isContentPreview: true };
    expect(isPubliclyVisible(future, ctx)).toBe(true);
  });

  it('現在と同時刻の投稿は表示する', () => {
    const ctx = { now: new Date('2025-01-01T00:00:00.000Z'), isContentPreview: false };
    expect(isPubliclyVisible(baseRaw, ctx)).toBe(true);
  });
});
