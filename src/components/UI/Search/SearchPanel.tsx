import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { useRouteChangeComplete } from '@/hooks/useRouteChangeComplete';
import { fadeIn } from '@/ui/animation';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

import { useSearchHeader } from './useSearchHeader';

type Props = {
  closeDialog: () => void;
};

export const SearchPanel = ({ closeDialog }: Props) => {
  const {
    SearchHeader,
    searchData: { suggest },
  } = useSearchHeader({ closeDialog });

  useRouteChangeComplete(closeDialog);

  return (
    <SearchMain>
      {SearchHeader}
      <SearchResult>
        {suggest.map((post) => (
          <Anchor key={post.slug} href={`/${post.slug}.html`} passHref prefetch={true}>
            {post.title}
          </Anchor>
        ))}
      </SearchResult>
      <SearchFooter>
        <span>Result: {suggest.length} posts</span>
        <a href="https://www.google.com/search?q=site:b.0218.jp" target="_blank" rel="noopener noreferrer">
          Google 検索
        </a>
      </SearchFooter>
    </SearchMain>
  );
};

const SearchMain = styled.div`
  display: block;
  z-index: var(--zIndex-search);
  isolation: isolate;
  width: 50vw;
  margin: auto;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease;
  border-radius: var(--border-radius-4);
  opacity: 0;
  background: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  animation-fill-mode: both;

  ${isMobile} {
    width: 80vw;
  }
`;

const SearchResult = styled.div`
  max-height: 50vh;
  margin: 0;
  padding: 0;
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
    background-color: var(--component-backgrounds-4);
  }
`;

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-half) var(--space-1);
  box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.16);
  color: var(--text-11);
  font-size: var(--font-size-sm);
`;
