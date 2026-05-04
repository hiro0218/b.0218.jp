import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/UI/Tooltip';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';
import { SEARCH_LABELS } from './constants';

type Props = {
  openDialogAction: () => void;
  onPrefetch?: () => void;
};

export function SearchTrigger({ openDialogAction, onPrefetch }: Props) {
  return (
    <Tooltip text={SEARCH_LABELS.searchTitle}>
      <Button
        aria-haspopup="dialog"
        aria-label={SEARCH_LABELS.searchTitle}
        className="link-style--hover-effect"
        onClick={openDialogAction}
        onFocus={onPrefetch}
        onMouseEnter={onPrefetch}
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
  width: var(--sizes-touch-target);
  height: var(--sizes-touch-target);
  pointer-events: auto;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: var(--radii-full);
  transition: transform var(--transition-fast);

  @media (--isDesktop) {
    width: var(--spacing-4);
    height: var(--spacing-4);
  }

  &::after {
    border-radius: var(--radii-full);
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    color: var(--colors-gray-1000);
  }
`;
