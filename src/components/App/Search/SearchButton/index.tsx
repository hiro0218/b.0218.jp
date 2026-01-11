import { Tooltip } from '@/components/UI/Tooltip';
import { ICON_SIZE_SM, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';
import { SEARCH_LABELS } from '../constants';

type Props = {
  openDialogAction: () => void;
};

export function SearchButton({ openDialogAction }: Props) {
  return (
    <Tooltip text={SEARCH_LABELS.searchTitle}>
      <Button aria-haspopup="dialog" className="link-style--hover-effect" onClick={openDialogAction} type="button">
        <MagnifyingGlassIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      </Button>
    </Tooltip>
  );
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-4);
  height: var(--spacing-4);
  pointer-events: auto;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radii-full);
  transition:
    background-color 0.2s var(--easings-ease-out-expo),
    transform 0.1s var(--easings-ease-out-expo);

  &::after {
    border-radius: var(--radii-full);
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    color: var(--colors-gray-1000);
  }
`;
