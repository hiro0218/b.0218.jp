import { Tooltip } from '@/components/UI/Tooltip';
import { ICON_SIZE_SM, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';
import type { OnCloseDialogProps } from '../../types';
import { SEARCH_LABELS } from '../../utils/constants';

type Props = {
  openDialog: OnCloseDialogProps;
};

/**
 * 検索ボタンコンポーネント
 */
export function SearchButton({ openDialog }: Props) {
  return (
    <Button aria-haspopup="dialog" className="link-style--hover-effect" onClick={openDialog} type="button">
      <Tooltip text={SEARCH_LABELS.searchTitle} />
      <MagnifyingGlassIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
    </Button>
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
    background-color 0.2s ease-out,
    transform 0.1s ease-out;

  &::after {
    border-radius: var(--radii-full);
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    color: var(--colors-gray-12);
  }
`;
