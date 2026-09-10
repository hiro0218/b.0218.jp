import { XCircleIcon } from '@phosphor-icons/react';

import { IconButton } from '@/components/UI/IconButton';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css } from '@/ui/styled';

type Props = {
  onClear: () => void;
  disabled?: boolean;
};

export function SearchClearButton({ onClear, disabled = false }: Props) {
  return (
    <IconButton
      aria-label="検索キーワードをクリア"
      className={disabledStyle}
      disabled={disabled}
      onClick={onClear}
      size="touch"
    >
      <XCircleIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </IconButton>
  );
}

const disabledStyle = css`
  &:disabled {
    opacity: 0.3;
  }
`;
