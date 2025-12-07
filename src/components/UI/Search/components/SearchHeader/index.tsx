'use client';

import { useEffect, useId, useRef } from 'react';

import { ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons';
import { css, styled } from '@/ui/styled';

interface SearchHeaderProps {
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

/**
 * 検索入力ヘッダーコンポーネント
 * @performance 初回マウント時のみfocusを実行し、不要な再レンダリングを防止
 */
export function SearchHeader({ onKeyUp, onKeyDown, searchQuery }: SearchHeaderProps) {
  const refInput = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  useEffect(() => {
    // タッチデバイスではキーボードが画面を覆うため、自動フォーカスを避ける
    if (window.matchMedia('(hover: hover)').matches) {
      refInput.current?.focus();
    }
  }, []);

  return (
    <div className={headerStyle}>
      <label className={headerIconStyle} htmlFor={searchInputId}>
        <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </label>
      <SearchInput
        aria-autocomplete="list"
        aria-label="検索キーワード"
        autoComplete="off"
        defaultValue={searchQuery}
        id={searchInputId}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        placeholder="記事タイトルやタグから検索する"
        ref={refInput}
        role="searchbox"
        type="text"
      />
    </div>
  );
}

const headerStyle = css`
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--colors-gray-400);
`;

const headerIconStyle = css`
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-1) 0 var(--spacing-2);
`;

const SearchInput = styled.input`
  width: 100%;
  height: var(--spacing-4);
  padding: 0;
  font-size: var(--font-sizes-md);
  border: none;

  &::placeholder {
    font-size: var(--font-sizes-sm);
    color: var(--colors-gray-900);
  }

  &:focus {
    outline: none;
  }
`;
