import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { IconButton } from '@/components/UI/IconButton';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css } from '@/ui/styled';

import { SEARCH_LABELS } from './constants';

type Props = {
  openDialogAction: () => void;
  onPrefetch?: () => void;
};

export function SearchTrigger({ openDialogAction, onPrefetch }: Props) {
  return (
    <IconButton
      aria-haspopup="dialog"
      aria-label={SEARCH_LABELS.searchTitle}
      className={pointerEventsStyle}
      onClick={openDialogAction}
      onFocus={onPrefetch}
      onMouseEnter={onPrefetch}
      tooltip={SEARCH_LABELS.searchTitle}
    >
      <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </IconButton>
  );
}

const pointerEventsStyle = css`
  pointer-events: auto;
`;
