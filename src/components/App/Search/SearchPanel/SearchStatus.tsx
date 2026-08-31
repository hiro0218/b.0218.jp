import { createSearchStatusMessage, type SearchMessageOptions } from './utils/createSearchMessage';

type SearchStatusProps = SearchMessageOptions;

/**
 * @summary スクリーンリーダー向け検索ステータス。
 * aria-live="polite" により検索結果の変化をスクリーンリーダーユーザーに通知する。
 * 視覚的には表示されない（sr-only）。
 */
export function SearchStatus({ resultsCount, searchQuery }: SearchStatusProps) {
  const statusMessage = createSearchStatusMessage({ resultsCount, searchQuery });

  return (
    <div aria-atomic="true" aria-live="polite" className="sr-only" role="status">
      {statusMessage}
    </div>
  );
}
