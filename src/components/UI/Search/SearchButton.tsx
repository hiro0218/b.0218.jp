import { ICON_SIZE_SM, MagnifyingGlassIcon } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

import type { onCloseDialogProps } from './type';

type Props = {
  openDialog: onCloseDialogProps;
};

export function SearchButton({ openDialog }: Props) {
  return (
    <Button aria-haspopup="dialog" aria-label="Search" onClick={openDialog} type="button">
      <MagnifyingGlassIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-4);
  height: var(--space-4);
  pointer-events: auto;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--border-radius-full);
  transition: background-color 0.2s ease;

  ${showHoverBackground}

  &::after {
    border-radius: var(--border-radius-full);
  }

  svg {
    color: var(--text-12);
  }
`;
