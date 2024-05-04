import type { MutableRefObject } from 'react';
import { forwardRef, useMemo } from 'react';

import { fadeIn } from '@/ui/animation';
import { styled } from '@/ui/styled';

import { useToast } from './useToast';

type RefProps = MutableRefObject<HTMLDivElement>;
type Props = {
  message: string;
  onHideToast: () => void;
};

export const Toast = (message: string) => {
  const { ref, showToast, hideToast, toastMessage } = useToast(message);

  const Component = useMemo(
    () => <ToastComponent message={toastMessage} onHideToast={hideToast} ref={ref} />,
    [hideToast, ref, toastMessage],
  );

  return {
    Component,
    showToast,
    hideToast,
  };
};

const ToastComponent = forwardRef(function ToastComponent({ message, onHideToast }: Props, ref: RefProps) {
  return (
    <Container aria-hidden="false" onClick={onHideToast} ref={ref} role="tooltip">
      {message}
    </Container>
  );
});

const Container = styled.div`
  position: fixed;
  bottom: var(--space-1);
  left: var(--space-1);
  z-index: var(--zIndex-base);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--dark-foregrounds);
  white-space: nowrap;
  user-select: none;
  background-color: var(--dark-backgrounds);
  isolation: isolate;
  border-radius: var(--border-radius-4);
  opacity: 0;

  &[aria-hidden='true'] {
    animation: ${fadeIn} 0.4s linear both;
  }
`;
