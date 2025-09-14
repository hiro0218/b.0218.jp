'use client';

import { memo, useEffect, useId, useRef } from 'react';

import { ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';

interface SearchHeaderProps {
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

/**
 * 検索入力ヘッダーコンポーネント
 * @performance 初回マウント時のみfocusを実行し、不要な再レンダリングを防止
 */
export const SearchHeader = memo(function SearchHeader({ onKeyUp, onKeyDown, searchQuery }: SearchHeaderProps) {
  const refInput = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  // パフォーマンス最適化: 初回マウント時のみfocus
  useEffect(() => {
    refInput.current?.focus();
  }, []); // 依存配列空で初回のみ実行

  return (
    <Header>
      <HeaderIcon htmlFor={searchInputId}>
        <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </HeaderIcon>
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
    </Header>
  );
});

const Header = styled.div`
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--colors-gray-6);
`;

const HeaderIcon = styled.label`
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
    color: var(--colors-gray-11);
  }

  &:focus {
    outline: none;
  }
`;
