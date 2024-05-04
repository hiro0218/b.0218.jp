import { useCallback, useEffect, useId, useRef } from 'react';

import { ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';

import type { onKeyupProps } from './type';

export const SearchHeader = ({ onKeyup }: { onKeyup: onKeyupProps }) => {
  const refInput = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  const onClick = useCallback(() => {
    const keyupEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    refInput?.current?.dispatchEvent(keyupEvent);
  }, []);

  useEffect(() => {
    refInput?.current?.focus();
  }, []);

  return (
    <Header>
      <HeaderIcon htmlFor={searchInputId}>
        <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </HeaderIcon>
      <SearchInput
        autoComplete="off"
        id={searchInputId}
        onKeyUp={onKeyup}
        placeholder="記事タイトルやタグから検索する（Enterで検索結果表示）"
        ref={refInput}
        role="searchbox"
        type="text"
      />
      <SubmitButton onClick={onClick} type="button">
        Enterで検索
      </SubmitButton>
    </Header>
  );
};

const Header = styled.div`
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--borders-6);
`;

const HeaderIcon = styled.label`
  display: flex;
  align-items: center;
  padding: 0 var(--space-1) 0 var(--space-2);
`;

const SubmitButton = styled.button`
  position: absolute;
  top: 25%;
  right: var(--space-1);
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs);
  color: var(--text-11);
  white-space: nowrap;
  background-color: var(--component-backgrounds-3);
  border: 1px solid var(--borders-6);
  border-radius: var(--border-radius-2);

  &:hover {
    background-color: var(--component-backgrounds-4);
  }

  &:focus,
  &:active {
    background-color: var(--component-backgrounds-5);
    border-color: var(--borders-7);
    outline: none;
  }
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

  &:placeholder-shown + ${SubmitButton} {
    display: none;
  }

  &:focus {
    outline: none;
  }
`;
