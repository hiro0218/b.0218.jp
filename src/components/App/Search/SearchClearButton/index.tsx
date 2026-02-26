import { ICON_SIZE_XS, XMarkIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = {
  onClear: () => void;
  disabled?: boolean;
};

export function SearchClearButton({ onClear, disabled = false }: Props) {
  return (
    <Button aria-label="検索キーワードをクリア" disabled={disabled} onClick={onClear} type="button">
      <XMarkIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-4);
  height: var(--spacing-4);
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radii-full);
  transition: background-color 0.2s var(--easings-ease-out-expo);

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  svg {
    color: var(--colors-gray-900);
  }
`;
