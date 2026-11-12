'use client';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import type { KeyboardEvent, RefObject } from 'react';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css, styled } from '@/ui/styled';
import { SEARCH_LABELS } from '../constants';
import { SearchClearButton } from './SearchClearButton';

interface SearchHeaderProps {
  value: string;
  inputRef: RefObject<HTMLInputElement | null>;
  activeDescendantId?: string;
  listId: string;
  /** 一覧（listbox）が無いときは aria-controls を付けない。存在しない ID を指すと、axe（aria-valid-attr-value）に違反するため */
  hasList: boolean;
  onValueChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  /** 消したあと、呼び出し側が入力欄へ焦点を戻す */
  onClear: () => void;
}

export function SearchHeader({
  value,
  inputRef,
  activeDescendantId,
  listId,
  hasList,
  onValueChange,
  onKeyDown,
  onClear,
}: SearchHeaderProps) {
  const { inputProps } = useTextField(
    {
      'aria-label': '検索キーワード',
      type: 'search',
      autoComplete: 'off',
      value,
      onChange: onValueChange,
      inputMode: 'search',
    },
    inputRef,
  );

  return (
    <div className={headerStyle}>
      <div className={fieldStyle}>
        <MagnifyingGlassIcon aria-hidden="true" className={iconStyle} height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
        <SearchInput
          {...mergeProps(inputProps, {
            'aria-activedescendant': activeDescendantId,
            'aria-autocomplete': 'list' as const,
            'aria-controls': hasList ? listId : undefined,
            'aria-expanded': hasList,
            onKeyDown,
            placeholder: SEARCH_LABELS.searchPlaceholder,
            role: 'combobox' as const,
          })}
          ref={inputRef}
        />
        {value ? <SearchClearButton onClear={onClear} /> : null}
      </div>
    </div>
  );
}

// 外側の余白を省かない。省くと、焦点の枠（面の外に 2px あけた 2px）が外側の面（SearchDialog の Surface）の端で切られる。
// 枠を面の内側に描かない。入力欄は開いている間ずっと焦点を持つので、内側の線が常に見え、サイトの焦点の枠（外側に 2px あける）とも形が違う
const headerStyle = css`
  padding: var(--spacing-100);
`;

// 焦点が消去ボタンなど入力欄の外へ移ったら、面の枠を残さない（:has が外れて消える）。残すと、移った先の枠と二重になる。
// 消去ボタンを短くせず、アイコンにもしない。消去は言葉のボタンにする決まり（DESIGN.md）で、8 字の幅は縮められない
const fieldStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-100);
  align-items: center;
  justify-content: flex-end;
  padding-inline: var(--spacing-300) calc(var(--search-close-size) - var(--search-close-overhang));
  background-color: var(--colors-gray-a-75);
  border-radius: var(--radii-md);

  &:has(input:focus-visible) {
    outline: var(--border-widths-medium) solid var(--colors-focus-ring);
    outline-offset: var(--border-widths-medium);
  }
`;

const iconStyle = css`
  flex-shrink: 0;
  color: var(--colors-gray-700);
`;

// プレースホルダーの文字を、入力した文字と別の大きさにしない。打ち始めで文字の大きさが変わるため
// 幅の下限を 10rem（160px）より狭くしない。「ブラウザ」など数文字の語が欠ける
const SearchInput = styled.input`
  flex: 1 1 10rem;
  min-width: 0;
  height: var(--spacing-600);
  min-height: var(--control-min-size);
  padding: 0;
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-900);
  cursor: text;
  background-color: transparent;
  border: none;

  &::placeholder {
    color: var(--colors-gray-700);
  }

  /* stylelint-disable-next-line plugin/browser-compat */
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }

  &:focus {
    outline: none;
  }
`;
