/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import * as safeSessionStorage from '@/lib/browser/safeSessionStorage';
import type { SearchResultItem } from '../../types';
import { useSearchStatePersistence } from './useSearchStatePersistence';

vi.mock('@/lib/browser/safeSessionStorage', () => ({
  getSessionStorage: vi.fn(),
  setSessionStorage: vi.fn(),
  removeSessionStorage: vi.fn(),
}));

const FIXED_NOW = 1_000_000;
const STORAGE_KEY = 'search-state';

function createSearchState() {
  return {
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
    ] satisfies SearchResultItem[],
  };
}

function setupClock() {
  vi.clearAllMocks();
  vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
}

test('saveSearchState が呼ばれた場合、timestamp 付きで sessionStorage に保存する', () => {
  setupClock();
  const state = createSearchState();

  const { result } = renderHook(() => useSearchStatePersistence());
  result.current.saveSearchState(state);

  expect(safeSessionStorage.setSessionStorage).toHaveBeenCalledWith(
    STORAGE_KEY,
    expect.objectContaining({
      query: 'React',
      results: state.results,
      timestamp: FIXED_NOW,
    }),
  );
});

test('rerender しても返却関数の参照を維持する', () => {
  setupClock();

  const { result, rerender } = renderHook(() => useSearchStatePersistence());
  const { saveSearchState, loadSearchState, clearSearchState } = result.current;

  rerender();

  expect(result.current.saveSearchState).toBe(saveSearchState);
  expect(result.current.loadSearchState).toBe(loadSearchState);
  expect(result.current.clearSearchState).toBe(clearSearchState);
});

test('loadSearchState で有効な状態が存在する場合、timestamp を除いて返す', () => {
  setupClock();
  const state = createSearchState();
  vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue({ ...state, timestamp: FIXED_NOW });

  const { result } = renderHook(() => useSearchStatePersistence());
  const loaded = result.current.loadSearchState();

  expect(safeSessionStorage.getSessionStorage).toHaveBeenCalledWith(STORAGE_KEY);
  expect(loaded).toEqual({ query: state.query, results: state.results });
});

test('loadSearchState で 30 分以上経過した状態の場合、null を返して storage から削除する', () => {
  setupClock();
  const state = createSearchState();
  vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue({
    ...state,
    timestamp: FIXED_NOW - 31 * 60 * 1000,
  });

  const { result } = renderHook(() => useSearchStatePersistence());
  const loaded = result.current.loadSearchState();

  expect(loaded).toBeNull();
  expect(safeSessionStorage.removeSessionStorage).toHaveBeenCalledWith(STORAGE_KEY);
});

test('loadSearchState で storage に状態が存在しない場合、null を返す', () => {
  setupClock();
  vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue(null);

  const { result } = renderHook(() => useSearchStatePersistence());
  const loaded = result.current.loadSearchState();

  expect(loaded).toBeNull();
});

test('loadSearchState で壊れた状態が保存されている場合、null を返して storage から削除する', () => {
  setupClock();
  vi.mocked(safeSessionStorage.getSessionStorage).mockReturnValue({
    query: 'React',
    results: undefined,
    timestamp: FIXED_NOW,
  });

  const { result } = renderHook(() => useSearchStatePersistence());
  const loaded = result.current.loadSearchState();

  expect(loaded).toBeNull();
  expect(safeSessionStorage.removeSessionStorage).toHaveBeenCalledWith(STORAGE_KEY);
});
