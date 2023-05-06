import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { useRouteChangeComplete } from '@/hooks/useRouteChangeComplete';
import escapeHTML from '@/lib/escapeHTML';
import { fadeIn } from '@/ui/animation';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

import { useSearchHeader } from './useSearchHeader';

type Props = {
  closeDialog: () => void;
};

const markEscapedHTML = (text: string, markText: string) => {
  const tagName = 'mark';
  const openingSymbol = '★';
  const closingSymbol = '☆';

  const index = text.toLowerCase().indexOf(markText.toLowerCase());
  const title = escapeHTML(
    index !== -1
      ? `${text.slice(0, index)}${openingSymbol}${text.slice(
          index,
          index + markText.length,
        )}${closingSymbol}${text.slice(index + markText.length)}`
      : text,
  )
    .replace(openingSymbol, `<${tagName}>`)
    .replace(closingSymbol, `</${tagName}>`);

  return title;
};

export const SearchPanel = ({ closeDialog }: Props) => {
  const {
    SearchHeader,
    searchData: { suggest, keyword },
  } = useSearchHeader({ closeDialog });

  useRouteChangeComplete(closeDialog);

  return (
    <SearchMain>
      {SearchHeader}
      <SearchResult>
        {suggest.map(({ title, slug }) => {
          const escapedTitle = markEscapedHTML(title, keyword);

          return (
            <Anchor
              dangerouslySetInnerHTML={{ __html: escapedTitle }}
              href={`/${slug}.html`}
              key={slug}
              passHref
              prefetch={true}
            />
          );
        })}
      </SearchResult>
      <SearchFooter>
        <span>Result: {suggest.length} posts</span>
        <a href="https://www.google.com/search?q=site:b.0218.jp" rel="noopener noreferrer" target="_blank">
          Google 検索
        </a>
      </SearchFooter>
    </SearchMain>
  );
};

const SearchMain = styled.div`
  z-index: var(--zIndex-search);
  display: block;
  width: 50vw;
  margin: auto;
  overflow: hidden;
  background: #fff;
  isolation: isolate;
  border-radius: var(--border-radius-4);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 0;
  animation: ${fadeIn} 0.8s ease;
  animation-fill-mode: both;

  ${isMobile} {
    width: 80vw;
  }
`;

const SearchResult = styled.div`
  max-height: 50vh;
  padding: 0;
  margin: 0;
  overflow-x: none;
  overflow-y: auto;

  ${isMobile} {
    max-height: 60vh;
  }
`;

const Anchor = styled(_Anchor)`
  display: block;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);

  &:hover {
    background-color: var(--component-backgrounds-3);
  }

  &:active {
    background-color: var(--component-backgrounds-4);
  }
`;

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--text-11);
  border-top: 1px solid var(--borders-6);

  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;
