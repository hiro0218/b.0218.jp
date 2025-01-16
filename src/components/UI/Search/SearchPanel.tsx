import { memo, useMemo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { useRouteChangeComplete } from '@/hooks/useRouteChangeComplete';
import escapeHTML from '@/lib/escapeHTML';
import { styled } from '@/ui/styled/static';

import type { SearchProps, onCloseDialogProps } from './type';
import { useSearchHeader } from './useSearchHeader';

type Props = {
  closeDialog: onCloseDialogProps;
};

const HIGHLIGHT_TAG_NAME = 'mark';

const markEscapedHTML = (text: string, markTexts: string[]) => {
  const escapedText = escapeHTML(text);
  const regEx = new RegExp(markTexts.join('|'), 'gi');
  return escapedText.replace(regEx, `<${HIGHLIGHT_TAG_NAME}>$&</${HIGHLIGHT_TAG_NAME}>`);
};

const Result = memo(function Result({
  suggestions,
  markedTitles,
}: {
  suggestions: SearchProps[];
  markedTitles: string[];
}) {
  return (
    <SearchResult>
      {suggestions.map(({ slug }, index) => {
        return (
          <Anchor
            dangerouslySetInnerHTML={{ __html: markedTitles[index] }}
            href={`/${slug}.html`}
            key={slug}
            prefetch
          />
        );
      })}
    </SearchResult>
  );
});

const Footer = memo(function Footer({ resultNumber }: { resultNumber: number }) {
  return (
    <SearchFooter>
      <span>Result: {resultNumber} posts</span>
      <a href="https://www.google.com/search?q=site:b.0218.jp" rel="noreferrer" target="_blank">
        Google 検索
      </a>
    </SearchFooter>
  );
});

export function SearchPanel({ closeDialog }: Props) {
  const {
    SearchHeader,
    searchData: { suggestions, keyword },
  } = useSearchHeader({ closeDialog });

  const splitKeyword = useMemo(() => keyword.split(' '), [keyword]);
  const markedTitles = useMemo(() => {
    return suggestions.map(({ title }) => markEscapedHTML(title, splitKeyword));
  }, [suggestions, splitKeyword]);

  useRouteChangeComplete(closeDialog);

  return (
    <SearchMain role="search">
      {SearchHeader}
      <Result markedTitles={markedTitles} suggestions={suggestions} />
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
  isolation: isolate;
  border-radius: var(--border-radius-4);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 0;
  animation: fadeIn 0.8s ease;
  animation-fill-mode: both;

  @media (--isMobile) {
    width: 80vw;
  }
`;

const SearchResult = styled.div`
  max-height: 50vh;
  padding: 0;
  margin: 0;
  overflow-x: none;
  overflow-y: auto;

  &:not(:empty) {
    padding: var(--space-½) var(--space-1);
  }

  @media (--isMobile) {
    max-height: 60vh;
  }
`;

const Anchor = styled(_Anchor)`
  display: block;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-8);

  &:hover {
    background-color: var(--color-gray-3);
  }

  &:active {
    background-color: var(--color-gray-4);
  }
`;

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--color-gray-11);
  border-top: 1px solid var(--color-gray-6);

  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;
