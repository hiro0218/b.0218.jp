import type { ReactNode } from 'react';
import { styled } from '@/ui/styled';

export type IconSwapActiveIcon = 'primary' | 'secondary';

type IconSwapProps = {
  activeIcon: IconSwapActiveIcon;
  primaryIcon: ReactNode;
  secondaryIcon: ReactNode;
};

/**
 * @summary 同一スロット内で primary / secondary のアイコンを切り替える。
 */
export function IconSwap({ activeIcon, primaryIcon, secondaryIcon }: IconSwapProps) {
  return (
    <Root aria-hidden="true" data-active-icon={activeIcon}>
      <IconSlot data-icon="primary">{primaryIcon}</IconSlot>
      <IconSlot data-icon="secondary">{secondaryIcon}</IconSlot>
    </Root>
  );
}

const Root = styled.span`
  --icon-swap-dur: 200ms;
  --icon-swap-start-scale: 0.25;
  --icon-swap-ease: ease-in-out;
  position: relative;
  display: inline-grid;

  &[data-active-icon='primary'] > [data-icon='primary'],
  &[data-active-icon='secondary'] > [data-icon='secondary'] {
    opacity: 1;
    transform: scale(1);
  }

  &[data-active-icon='primary'] > [data-icon='secondary'],
  &[data-active-icon='secondary'] > [data-icon='primary'] {
    opacity: 0;
    transform: scale(var(--icon-swap-start-scale));
  }

  @media (prefers-reduced-motion: reduce) {
    > [data-icon] {
      transition: none !important;
    }
  }
`;

const IconSlot = styled.span`
  display: grid;
  grid-area: 1 / 1;
  place-items: center;
  transition:
    opacity var(--icon-swap-dur) var(--icon-swap-ease),
    transform var(--icon-swap-dur) var(--icon-swap-ease);
`;
