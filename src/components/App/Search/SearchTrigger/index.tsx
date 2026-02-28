import { Tooltip } from '@/components/UI/Tooltip';
import { ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';
import { SEARCH_LABELS } from '../constants';

type Props = {
  openDialogAction: () => void;
};

export function SearchTrigger({ openDialogAction }: Props) {
  return (
    <Tooltip text={SEARCH_LABELS.searchTitle}>
      <Button
        aria-haspopup="dialog"
        aria-label={SEARCH_LABELS.searchTitle}
        className="link-style--hover-effect"
        onClick={openDialogAction}
        type="button"
      >
        <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
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
