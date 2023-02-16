import { useCallback, useEffect, useState } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  isActive: boolean;
  onClick: () => void;
};

export const Overlay = ({ isActive, onClick }: Props) => {
  const [isVisible, setIsVisible] = useState(isActive);
  const onTransitionEnd = useCallback(() => {
    if (!isActive) {
      setIsVisible(false);
    }
  }, [isActive]);

  useEffect(() => {
    setIsVisible(isActive);
  }, [isActive]);

  return <Div isActive={isActive} isVisible={isVisible} onClick={onClick} onTransitionEnd={onTransitionEnd} />;
};

const Div = styled.div<{
  isActive: boolean;
  isVisible: boolean;
}>`
  position: fixed;
  inset: 0;
  z-index: calc(var(--zIndex-search) - 1);
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  background-color: var(--overlay-backgrounds);
  isolation: isolate;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 0.4s ease, visibility 0.4s ease;
`;
