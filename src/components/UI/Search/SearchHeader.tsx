import { useId, useRef } from 'react';

import { ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled/dynamic';

import type { onKeyupProps } from './type';

export const SearchHeader = ({ onKeyup }: { onKeyup: onKeyupProps }) => {
  const refInput = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  return (
    <Header>
      <HeaderIcon htmlFor={searchInputId}>
        <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </HeaderIcon>
      <SearchInput
        autoComplete="off"
        id={searchInputId}
        onKeyUp={onKeyup}
        placeholder="記事タイトルやタグから検索する"
        ref={(el) => {
          refInput.current = el;
          refInput?.current?.focus();
        }}
        role="searchbox"
        type="text"
      />
    </Header>
  );
};

const Header = styled.div`
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--color-gray-6);
`;

const HeaderIcon = styled.label`
  display: flex;
  align-items: center;
  padding: 0 var(--space-1) 0 var(--space-2);
`;

const SearchInput = styled.input`
  width: 100%;
  height: var(--space-4);
  padding: 0;
  font-size: var(--font-size-md);
  border: none;

  &::placeholder {
    font-size: var(--font-size-sm);
    color: var(--color-gray-11);
  }

  &:focus {
    outline: none;
  }
`;
