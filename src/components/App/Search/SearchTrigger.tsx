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
  justify-content: center;
  min-width: var(--sizes-touch-target);
  cursor: pointer;

  &::before {
    border-radius: var(--radii-full);
  }

  @media (--isDesktop) {
    gap: var(--spacing-75);

    &::before {
      border-radius: var(--radii-sm);
    }
  }
`;

const Label = styled.span`
  display: none;

  @media (--isDesktop) {
    display: inline;
    font-family: var(--fonts-family-monospace);
    font-size: var(--font-sizes-sm);
    /* button 要素は独自の line-height を持つため、他のナビリンク（body の line-height を継承）と
       高さを揃えるために明示する */
    line-height: var(--line-heights-body);
  }
`;
