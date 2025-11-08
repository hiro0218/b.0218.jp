import { forwardRef, memo } from 'react';

import { styled } from '@/ui/styled';

interface ToastProps {
  message: string;
  onHideToast: () => void;
  isVisible: boolean;
}

/**
 * トースト通知コンポーネント
 * 自動消去機能を持つ通知メッセージを表示
 */
export const Toast = memo(
  forwardRef<HTMLDivElement, ToastProps>(({ message, onHideToast, isVisible }, ref) => {
    return (
      <Container
        aria-atomic="true"
        aria-live="polite"
        data-visible={isVisible}
        onClick={onHideToast}
        ref={ref}
        role="status"
      >
        {message}
      </Container>
    );
  }),
);

const Container = styled.div`
  position: fixed;
  bottom: var(--spacing-1);
  left: var(--spacing-1);
  z-index: var(--z-index-base);
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-sizes-xs);
  color: var(--colors-dark-foregrounds);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  background-color: var(--colors-dark-backgrounds);
  border-radius: var(--radii-4);
  isolation: isolate;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;

  &[data-visible='true'] {
    pointer-events: auto;
    opacity: 1;
    transform: translateY(0);
  }
`;
