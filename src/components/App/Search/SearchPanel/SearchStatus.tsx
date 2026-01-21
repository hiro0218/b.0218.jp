import { createSearchStatusMessage } from './utils/createSearchMessage';

type SearchStatusProps = {
  resultsCount: number;
  searchQuery: string;
};

/**
 * スクリーンリーダー向けの検索ステータスメッセージ
 *
 * @description
 * aria-live="polite" により、検索結果の変化をスクリーンリーダーユーザーに通知します。
 * 視覚的には表示されません（sr-only）。
 */
export function SearchStatus({ resultsCount, searchQuery }: SearchStatusProps) {
  const statusMessage = createSearchStatusMessage({ resultsCount, searchQuery });

  return (
    <div aria-live="polite" className="sr-only">
      {statusMessage}
    </div>
  );
}
