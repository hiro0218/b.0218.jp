import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
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
  const resultRefs = useRef(new Map<number, HTMLDivElement>());
  const navigation = useSearchNavigation({
    resultsLength: results.length,
    resultsRef,
    getResultRef: (index) => resultRefs.current.get(index),
  });

  return (
    <div {...navigation.containerProps}>
      <input aria-label="検索キーワード" type="search" />
      <div data-search-results>
        {results.map((result, index) => (
          <div
            data-focused={navigation.focusedIndex === index}
            key={result.slug}
            ref={(element) => {
              if (element) resultRefs.current.set(index, element);
            }}
            tabIndex={-1}
          >
            {result.title}
          </div>
        ))}
      </div>
      <output aria-label="focused index">{navigation.focusedIndex}</output>
    </div>
  );
}

describe('useSearchNavigation', () => {
  it('type="search" の入力欄から ArrowDown で検索結果へ移動する', () => {
    render(<SearchNavigationHarness />);

    fireEvent.keyDown(screen.getByRole('searchbox', { name: '検索キーワード' }), { key: 'ArrowDown' });

    expect(screen.getByLabelText('focused index').textContent).toBe('0');
  });
});
