/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as safeSessionStorage from '@/lib/browser/safeSessionStorage';
import type { SearchResultItem } from '../../types';
import { useSearchStatePersistence } from './useSearchStatePersistence';

vi.mock('@/lib/browser/safeSessionStorage', () => ({
  getSessionStorage: vi.fn(),
  setSessionStorage: vi.fn(),
  removeSessionStorage: vi.fn(),
}));

describe('useSearchStatePersistence', () => {
  const mockSearchState = {
    query: 'React',
    results: [
      {
        title: 'React入門',
        slug: '202501010000',
        tags: ['React'],
        matchType: 'EXACT' as const,
        matchedIn: 'title' as const,
      },
      {
        title: 'React Hooks',
        slug: '202501020000',
        tags: ['React', 'Hooks'],
        matchType: 'PARTIAL' as const,
        matchedIn: 'both' as const,
      },
    ] as SearchResultItem[],
  };

  const mockStoredState = {
    ...mockSearchState,
    timestamp: 1000000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('saveSearchState が正しく動作することを検証', () => {
    const { result } = renderHook(() => useSearchStatePersistence());

    result.current.saveSearchState(mockSearchState);

    expect(safeSessionStorage.setSessionStorage).toHaveBeenCalledWith(
      'search-state',
      expect.objectContaining({
        query: 'React',
        results: mockSearchState.results,
        timestamp: 1000000,
      }),
    );
  });

  test('loadSearchState が有効な状態を返すことを検証', () => {
    vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue(mockStoredState);

    const { result } = renderHook(() => useSearchStatePersistence());

    const loaded = result.current.loadSearchState();

    expect(safeSessionStorage.getSessionStorage).toHaveBeenCalledWith('search-state');
    expect(loaded).toEqual({
      query: 'React',
      results: mockSearchState.results,
    });
  });

  test('loadSearchState が期限切れの状態を返さないことを検証', () => {
    const expiredState = {
      ...mockStoredState,
      timestamp: Date.now() - 31 * 60 * 1000,
    };
    vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue(expiredState);

    const { result } = renderHook(() => useSearchStatePersistence());

    const loaded = result.current.loadSearchState();

    expect(loaded).toBeNull();
    expect(safeSessionStorage.removeSessionStorage).toHaveBeenCalledWith('search-state');
  });

  test('loadSearchState が存在しない状態でnullを返すことを検証', () => {
    vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue(null);

    const { result } = renderHook(() => useSearchStatePersistence());

    const loaded = result.current.loadSearchState();

    expect(loaded).toBeNull();
  });
});
