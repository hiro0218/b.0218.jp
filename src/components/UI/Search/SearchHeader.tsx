import { useEffect, useId, useRef } from 'react';
import { type KeyboardEvent } from 'react';

import { ICON_SIZE_XS, RxMagnifyingGlass } from '@/ui/icons';
import { styled } from '@/ui/styled';

export const SearchHeader = ({ onKeyup }: { onKeyup: (e: KeyboardEvent<HTMLInputElement>) => void }) => {
  const refInput = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  useEffect(() => {
    refInput?.current?.focus();
  }, []);

  return (
    <Header>
      <HeaderIcon htmlFor={searchInputId}>
        <RxMagnifyingGlass size={ICON_SIZE_XS} />
      </HeaderIcon>
      <SearchInput
        autoComplete="off"
        id={searchInputId}
        onKeyUp={onKeyup}
        placeholder="記事タイトルやタグから検索する（Enterで検索結果表示）"
        ref={refInput}
        type="text"
      />
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid var(--borders-6);
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
    color: var(--text-11);
  }

  &:focus {
    outline: none;
  }
`;
