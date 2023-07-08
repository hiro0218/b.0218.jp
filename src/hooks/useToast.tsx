import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { createToast } from 'react-simple-toasts';

import { styled } from '@/ui/styled';

const Toast = createToast({
  duration: 2000,
  clickClosable: true,
  position: 'bottom-left',
  maxVisibleToasts: 1,
  render: (message) => <ToastUI message={message} />,
});

function ToastUI({ message }: { message: ReactNode }) {
  return <Container>{message}</Container>;
}

const Container = styled.div`
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--dark-foregrounds);
  white-space: nowrap;
  user-select: none;
  background-color: var(--dark-backgrounds);
  border-radius: var(--border-radius-4);
`;

function useToast(message: string) {
  return useCallback(() => Toast(message), [message]);
}

export default useToast;
