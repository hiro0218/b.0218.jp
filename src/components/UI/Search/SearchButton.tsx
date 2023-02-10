import { RxMagnifyingGlass } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

type Props = {
  openDialog: () => void;
};

export const SearchButton = ({ openDialog }: Props) => {
  return (
    <Button type="button" aria-label="Search" onClick={openDialog}>
      <RxMagnifyingGlass size="20" />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  transition: background-color 0.2s ease;
  border: none;
  border-radius: var(--border-radius-full);
  background: none;
  cursor: pointer;
  pointer-events: auto;

  ${showHoverBackground}

  &::after {
    border-radius: var(--border-radius-full);
  }

  svg {
    color: var(--text-12);
  }
`;
