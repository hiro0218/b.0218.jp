/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as safeSessionStorage from '@/lib/safeSessionStorage';
import type { SearchProps } from '../types';
import { useSearchStatePersistence } from './useSearchStatePersistence';

vi.mock('@/lib/safeSessionStorage', () => ({
  getFromSession: vi.fn(),
  setToSession: vi.fn(),
  removeFromSession: vi.fn(),
}));

describe('useSearchStatePersistence', () => {
  const mockSearchState = {
    query: 'React',
    results: [
      { title: 'React入門', slug: '202501010000', tags: ['React'] },
      { title: 'React Hooks', slug: '202501020000', tags: ['React', 'Hooks'] },
    ] as SearchProps[],
    focusedIndex: 0,
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

  test('フックが正しくインポートできる', () => {
    expect(useSearchStatePersistence).toBeDefined();
    expect(typeof useSearchStatePersistence).toBe('function');
  });

  test('saveSearchState が正しく動作することを検証', () => {
    const { result } = renderHook(() => useSearchStatePersistence());

    result.current.saveSearchState(mockSearchState);

    expect(safeSessionStorage.setToSession).toHaveBeenCalledWith(
      'search-state',
      expect.objectContaining({
        query: 'React',
        results: mockSearchState.results,
        focusedIndex: 0,
        timestamp: 1000000,
      }),
    );
  });

  test('loadSearchState が有効な状態を返すことを検証', () => {
    vi.mocked(safeSessionStorage.getFromSession).mockReturnValue(mockStoredState);

    const { result } = renderHook(() => useSearchStatePersistence());

    const loaded = result.current.loadSearchState();

    expect(safeSessionStorage.getFromSession).toHaveBeenCalledWith('search-state');
    expect(loaded).toEqual({
      query: 'React',
      results: mockSearchState.results,
      focusedIndex: 0,
    });
  });

  test('loadSearchState が期限切れの状態を返さないことを検証', () => {
    const expiredState = {
      ...mockStoredState,
      timestamp: Date.now() - 31 * 60 * 1000,
    };
    vi.mocked(safeSessionStorage.getFromSession).mockReturnValue(expiredState);

    const { result } = renderHook(() => useSearchStatePersistence());

    const loaded = result.current.loadSearchState();

    expect(loaded).toBeNull();
    expect(safeSessionStorage.removeFromSession).toHaveBeenCalledWith('search-state');
  });

  test('loadSearchState が存在しない状態でnullを返すことを検証', () => {
    vi.mocked(safeSessionStorage.getFromSession).mockReturnValue(null);

    const { result } = renderHook(() => useSearchStatePersistence());

    const loaded = result.current.loadSearchState();

    expect(loaded).toBeNull();
  });

  test('clearSearchState が正しく動作することを検証', () => {
    const { result } = renderHook(() => useSearchStatePersistence());

    result.current.clearSearchState();

    expect(safeSessionStorage.removeFromSession).toHaveBeenCalledWith('search-state');
  });
});
