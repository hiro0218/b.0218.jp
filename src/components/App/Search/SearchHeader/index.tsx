'use client';

import { useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { useEffect, useRef } from 'react';

import { ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons';
import { css, styled } from '@/ui/styled';
import { SearchClearButton } from '../SearchClearButton';

interface SearchHeaderProps {
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  searchQuery: string;
}

/**
 * @performance 初回マウント時のみfocusを実行し、不要な再レンダリングを防止
 */
export function SearchHeader({ onKeyUp, onKeyDown, onClear, searchQuery }: SearchHeaderProps) {
  const refInput = useRef<HTMLInputElement>(null);

  const { labelProps, inputProps } = useTextField(
    {
      'aria-label': '検索キーワード',
      type: 'text',
      autoComplete: 'off',
      defaultValue: searchQuery,
      inputMode: 'search',
    },
    refInput,
  );

  useEffect(() => {
    // タッチデバイスではキーボードが画面を覆うため、自動フォーカスを避ける
    if (window.matchMedia('(hover: hover)').matches) {
      refInput.current?.focus();
    }
  }, []);

  const handleClear = () => {
    onClear();
    if (refInput.current) {
      refInput.current.value = '';
      refInput.current.focus();
    }
  };

  return (
    <div className={headerStyle}>
      <label {...labelProps} className={headerIconStyle}>
        <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </label>
      <SearchInput
        {...mergeProps(inputProps, {
          'aria-autocomplete': 'list' as const,
          role: 'searchbox' as const,
          placeholder: '記事タイトルまたはタグを検索',
          onKeyDown,
          onKeyUp,
        })}
        ref={refInput}
      />
      <div className={clearButtonWrapperStyle}>
        <SearchClearButton disabled={!searchQuery} onClear={handleClear} />
      </div>
    </div>
  );
}

const headerStyle = css`
  position: relative;
  display: flex;
  padding: var(--spacing-½) 0;
  background-color: var(--colors-gray-a-50);
  border-radius: var(--radii-4);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:focus-within {
    background-color: var(--colors-gray-a-100);
  }
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
  background-color: transparent;
  border: none;

  &::placeholder {
    font-size: var(--font-sizes-sm);
    color: var(--colors-gray-600);
  }

  &:focus {
    outline: none;
  }
`;

const clearButtonWrapperStyle = css`
  display: flex;
  align-items: center;
  padding-right: var(--spacing-1);
`;
