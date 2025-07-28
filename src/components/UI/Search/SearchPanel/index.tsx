import { useMemo } from 'react';

import { useRouteChangeComplete } from '@/hooks/useRouteChangeComplete';
import escapeHTML from '@/lib/escapeHTML';
import { styled } from '@/ui/styled/static';
import type { onCloseDialogProps } from '../type';
import { useSearchHeader } from '../useSearchHeader';
import { Footer } from './Footer';
import { Result } from './Result';

type Props = {
  closeDialog: onCloseDialogProps;
};

const HIGHLIGHT_TAG_NAME = 'mark';

const markEscapedHTML = (text: string, markTexts: string[]) => {
  const escapedText = escapeHTML(text);
  const regEx = new RegExp(markTexts.join('|'), 'gi');
  return escapedText.replace(regEx, `<${HIGHLIGHT_TAG_NAME}>$&</${HIGHLIGHT_TAG_NAME}>`);
};

export function SearchPanel({ closeDialog }: Props) {
  const {
    SearchHeader,
    searchData: { suggestions, keyword, focusedIndex },
    setResultRef,
  } = useSearchHeader({ closeDialog });

  const splitKeyword = useMemo(() => keyword.split(' '), [keyword]);
  const markedTitles = useMemo(() => {
    return suggestions.map(({ title }) => markEscapedHTML(title, splitKeyword));
  }, [suggestions, splitKeyword]);

  useRouteChangeComplete(closeDialog);

  return (
    <SearchMain aria-atomic="true" aria-label="サイト内検索" aria-live="polite" role="search">
      {SearchHeader}
      <div aria-live="polite" className="sr-only" id="search-results-status">
        {suggestions.length > 0
          ? `${suggestions.length}件の検索結果が見つかりました。${keyword ? `「${keyword}」の検索結果です。` : ''}`
          : keyword
            ? `「${keyword}」に一致する記事は見つかりませんでした。`
            : '検索キーワードを入力してください。'}
      </div>
      <Result
        focusedIndex={focusedIndex}
        keyword={keyword}
        markedTitles={markedTitles}
        setResultRef={setResultRef}
        suggestions={suggestions}
      />
      <Footer resultNumber={suggestions.length} />
    </SearchMain>
  );
}

const SearchMain = styled.div`
  z-index: var(--zIndex-search);
  display: block;
  width: 50vw;
  margin: auto;
  overflow: hidden;
  background-color: var(--white);
  border-radius: var(--border-radius-4);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  isolation: isolate;
  opacity: 0;
  animation: fadeIn 0.8s ease;
  animation-fill-mode: both;

  @media (--isMobile) {
    width: 80vw;
  }
`;
