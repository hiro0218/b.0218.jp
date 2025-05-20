import { Tooltip } from '@/components/UI/Tooltip';
import { ICON_SIZE_SM, MagnifyingGlassIcon } from '@/ui/icons';
import { styled } from '@/ui/styled/static';
import type { onCloseDialogProps } from './type';

type Props = {
  openDialog: onCloseDialogProps;
};

export function SearchButton({ openDialog }: Props) {
  return (
    <Button aria-haspopup="dialog" className="link-style--hover-effect" onClick={openDialog} type="button">
      <Tooltip text="記事検索" />
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

  &::after {
    border-radius: var(--border-radius-full);
  }

  svg {
    color: var(--color-gray-12);
  }
`;
