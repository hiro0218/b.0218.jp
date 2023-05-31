import { ICON_SIZE_SM, RxMagnifyingGlass } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

type Props = {
  openDialog: () => void;
};

export function SearchButton({ openDialog }: Props) {
  return (
    <Button aria-label="Search" onClick={openDialog} type="button">
      <RxMagnifyingGlass size={ICON_SIZE_SM} />
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
