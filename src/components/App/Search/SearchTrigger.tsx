import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css, cx, styled } from '@/ui/styled';

import { SEARCH_LABELS } from './constants';

type Props = {
  openDialogAction: () => void;
  onPrefetch?: () => void;
};

export function SearchTrigger({ openDialogAction, onPrefetch }: Props) {
  return (
    <Button
      aria-haspopup="dialog"
      aria-label={SEARCH_LABELS.searchTitle}
      className={cx('link-style', 'link-style--hover-effect', pointerEventsStyle)}
      onClick={openDialogAction}
      onFocus={onPrefetch}
      onMouseEnter={onPrefetch}
      type="button"
    >
      <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      <Label>{SEARCH_LABELS.searchTitle}</Label>
    </Button>
  );
}

const pointerEventsStyle = css`
  pointer-events: auto;
`;

const Button = styled.button`
  gap: var(--spacing-75);
  cursor: pointer;
`;

const Label = styled.span`
  display: none;

  @media (--isDesktop) {
    display: inline;
    font-family: var(--fonts-family-monospace);
    font-size: var(--font-sizes-sm);
  }
`;
