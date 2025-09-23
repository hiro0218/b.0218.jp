import { memo } from 'react';
import { styled } from '@/ui/styled';
import { createSearchResultMessage, createSearchStatusMessage } from './libs/createSearchMessage';

type SearchStatusProps = {
  resultsCount: number;
  searchQuery: string;
};

/**
 * スクリーンリーダー向け検索ステータスメッセージコンポーネント
 * @param resultsCount - 検索結果件数
 * @param searchQuery - 検索クエリ
 * @returns アクセシビリティ対応ステータスメッセージ
 */
export const SearchStatus = memo(function SearchStatus({ resultsCount, searchQuery }: SearchStatusProps) {
  const statusMessage = createSearchStatusMessage({ resultsCount, searchQuery });

  return (
    <div aria-live="polite" className="sr-only">
      {statusMessage}
    </div>
  );
});

type SearchResultMessageProps = {
  resultsCount: number;
  searchQuery: string;
};

/**
 * 表示用検索結果メッセージコンポーネント
 * @param resultsCount - 検索結果件数
 * @param searchQuery - 検索クエリ
 * @returns 検索結果サマリメッセージ
 */
export const SearchResultMessage = memo(function SearchResultMessage({
  resultsCount,
  searchQuery,
}: SearchResultMessageProps) {
  const resultMessage = createSearchResultMessage({ resultsCount, searchQuery });

  return <Message>{resultMessage}</Message>;
});

type SearchExternalLinkProps = {
  searchQuery?: string;
};

/**
 * 外部Google検索リンクコンポーネント
 * @param searchQuery - 検索クエリ（オプション）
 * @returns Google検索へのリンク
 */
export const SearchExternalLink = memo(function SearchExternalLink({ searchQuery }: SearchExternalLinkProps) {
  const query = searchQuery ? `site:b.0218.jp ${searchQuery}` : 'site:b.0218.jp';
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <SearchFooter>
      <a href={searchUrl} rel="noreferrer" target="_blank">
        {searchQuery ? `Google で「${searchQuery}」を検索` : 'Google 検索'}
      </a>
    </SearchFooter>
  );
});

const Message = styled.div`
  padding: var(--spacing-½);
  font-size: var(--font-sizes-xs);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-xs);
  color: var(--colors-gray-9);
`;

const SearchFooter = styled.footer`
  padding: var(--spacing-1);
  font-size: var(--font-sizes-xs);
  text-align: right;
  background-color: var(--colors-gray-a-2);
  border-top: 1px solid var(--colors-gray-6);

  a {
    color: var(--colors-gray-11);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
