import type { ForwardedRef } from 'react';
import { useMemo } from 'react';

import { styled } from '@/ui/styled/static';

import { useToast } from './useToast';

type Props = {
  message: string;
  onHideToast: () => void;
  ref: ForwardedRef<HTMLDivElement>;
};

export const Toast = (message: string) => {
  const { ref, showToast, hideToast, toastMessage } = useToast(message);

  const Component = useMemo(
    () => <ToastComponent message={toastMessage} onHideToast={hideToast} ref={ref} />,
    [hideToast, ref, toastMessage],
  );

  return {
    // biome-ignore lint/style/useNamingConvention: temp
    Component,
    showToast,
    hideToast,
  };
};

const ToastComponent = ({ message, onHideToast, ref }: Props) => {
  return (
    <Container aria-hidden="false" onClick={onHideToast} ref={ref} role="tooltip">
      {message}
    </Container>
  );
};

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
  border-radius: var(--border-radius-4);
  isolation: isolate;
  opacity: 0;

  &[aria-hidden='true'] {
    animation: fadeIn 0.4s linear both;
  }
`;
