import { CheckIcon, ProhibitIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';

import { type ClipboardCopyState, isCopyResultState } from '@/hooks/useClipboardCopy';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';

import { IconSwap } from './IconSwap';

type CopyFeedbackIconProps = {
  state: ClipboardCopyState;
  /** idle / copying のときに見せるアイコン */
  idleIcon: ReactNode;
};

// idle / copying の結果アイコンを、成功と別の絵にしない。成功と違う絵が隠れていると、成功へ切り替わるとき、絵は変わって見えるため
const RESULT_ICONS: Record<ClipboardCopyState, typeof CheckIcon> = {
  idle: CheckIcon,
  copying: CheckIcon,
  copied: CheckIcon,
  failed: XIcon,
  unsupported: ProhibitIcon,
};

/**
 * @summary コピー操作の状態を示すアイコン。idle のアイコンから、成功・失敗・未対応のアイコンへ切り替え、状態の色を付ける。
 */
export function CopyFeedbackIcon({ state, idleIcon }: CopyFeedbackIconProps) {
  const ResultIcon = RESULT_ICONS[state];

  return (
    <Root data-state={state}>
      <IconSwap
        activeIcon={isCopyResultState(state) ? 'secondary' : 'primary'}
        primaryIcon={idleIcon}
        secondaryIcon={<ResultIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
      />
    </Root>
  );
}

// 成功色を semantic token にしない。この部品だけが使い、共有する値ではないため
const Root = styled.span`
  --copy-success-color: var(--colors-grass-1200);
  display: contents;
  transition: color var(--transition-normal);

  &[data-state='copied'] {
    color: var(--copy-success-color);
  }

  &[data-state='failed'] {
    color: var(--colors-red-1200);
  }

  &[data-state='unsupported'] {
    color: var(--colors-gray-500);
  }
`;
