import { styled } from '@/ui/styled/static';
import { memo } from 'react';

export const Footer = memo(function Footer({ resultNumber }: { resultNumber: number }) {
  return (
    <SearchFooter>
      <span>Result: {resultNumber} posts</span>
      <a href="https://www.google.com/search?q=site:b.0218.jp" rel="noreferrer" target="_blank">
        Google 検索
      </a>
    </SearchFooter>
  );
});

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
