import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchResultItem } from '../../types';
import { useSearchNavigation } from './useSearchNavigation';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const results: SearchResultItem[] = [
  { slug: 'first-post', title: 'First post', tags: [], matchType: 'EXACT', matchedIn: 'title' },
  { slug: 'second-post', title: 'Second post', tags: [], matchType: 'EXACT', matchedIn: 'title' },
];

function SearchNavigationHarness() {
  const resultsRef = useRef(results);
  const navigation = useSearchNavigation({
    resultsLength: results.length,
    resultsRef,
  });

  return (
    <div {...navigation.containerProps}>
      <input aria-expanded="true" aria-label="検索キーワード" role="combobox" />
      <div data-search-results>
        {results.map((result, index) => (
          <div data-focused={navigation.focusedIndex === index} key={result.slug} tabIndex={-1}>
            {result.title}
          </div>
        ))}
      </div>
      <output aria-label="focused index">{navigation.focusedIndex}</output>
    </div>
  );
}

describe('useSearchNavigation', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('combobox の入力欄から ArrowDown で検索結果へ移動する', () => {
    render(<SearchNavigationHarness />);

    fireEvent.keyDown(screen.getByRole('combobox', { name: '検索キーワード' }), { key: 'ArrowDown' });

    expect(screen.getByLabelText('focused index').textContent).toBe('0');
  });

  it('loop 有効時は ArrowUp で最後の検索結果へ移動する', () => {
    render(<SearchNavigationHarness />);

    fireEvent.keyDown(screen.getByRole('combobox', { name: '検索キーワード' }), { key: 'ArrowUp' });

    expect(screen.getByLabelText('focused index').textContent).toBe('1');
  });

  it('Enter で選択中の検索結果へ遷移する', () => {
    render(<SearchNavigationHarness />);
    const input = screen.getByRole('combobox', { name: '検索キーワード' });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith('/first-post.html');
  });
});
