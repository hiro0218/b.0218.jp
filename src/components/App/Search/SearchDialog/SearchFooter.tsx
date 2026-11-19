import { styled } from '@/ui/styled';
import { SearchGoogleLink } from './SearchGoogleLink';

type SearchFooterProps = {
  searchQuery: string;
  /** 一覧（候補か結果）があるか。無いときは、↓ の案内を出さない */
  hasList: boolean;
  /** 一覧の行を選んでいるか。選んでいないときは、↑ と Enter の案内を出さない */
  hasSelection: boolean;
};

/**
 * @summary キー操作の案内と、Google 検索へのリンクを出すフッター。案内は、一覧の有無と選択の有無で切り替え、いま使えない操作（行を選んでいないときの ↑ と Enter）は出さない。
 */
export function SearchFooter({ searchQuery, hasList, hasSelection }: SearchFooterProps) {
  return (
    <Footer>
      <KeyHints>
        {hasList ? (
          <span>
            {hasSelection ? <kbd>↑</kbd> : null}
            <kbd>↓</kbd>選択
          </span>
        ) : null}
        {hasSelection ? (
          <span>
            <kbd>Enter</kbd>開く
          </span>
        ) : null}
        <span>
          <kbd>Esc</kbd>閉じる
        </span>
      </KeyHints>
      <SearchGoogleLink searchQuery={searchQuery} />
    </Footer>
  );
}

// Google 検索に white-space: nowrap を付けない。付けると、日本語 20 字の検索語（表示の上限）がダイアログの右端からはみ出す。
// footer 要素にしない。ダイアログは body 直下に描画されるので、footer が contentinfo のランドマークになる。
// すると search の中にランドマークが入れ子になり、axe の landmark-contentinfo-is-top-level に違反する。このフッターはページのフッターではない
const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-75);
  column-gap: var(--spacing-300);
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-100) var(--spacing-300);
  font-size: var(--font-sizes-xs);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-900);
  background-color: var(--colors-gray-a-75);
`;

// タッチの画面にキー案内を出さない。↑↓・Enter・Esc を使わず、案内が行を占めるだけになるため
const KeyHints = styled.div`
  display: none;
  flex-wrap: wrap;
  row-gap: var(--spacing-75);
  column-gap: var(--spacing-300);
  align-items: center;

  @media (--isWide) and (hover: hover) {
    display: flex;
  }

  span {
    display: inline-flex;
    gap: var(--spacing-75);
    align-items: center;
    white-space: nowrap;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--sizes-icon-sm);
    height: var(--sizes-icon-sm);
    padding: var(--spacing-75);
    font-size: var(--font-sizes-xs);
    background-color: var(--colors-gray-a-75);
    border-radius: var(--radii-sm);
  }
`;
