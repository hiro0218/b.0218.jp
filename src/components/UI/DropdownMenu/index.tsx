import { styled } from '@/ui/styled/static';
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';

type Props = {
  title: ReactNode;
  children: ReactNode;
  menuHorizontalPosition?: 'left' | 'right';
};

export const DropdownMenu = ({ title, children, menuHorizontalPosition = 'right' }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const toggleDropdownMenuContent = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Container ref={ref}>
      <Trigger
        className="link-style--hover-effect"
        type="button"
        aria-haspopup="menu"
        aria-controls={id}
        aria-expanded={isOpen}
        onClick={toggleDropdownMenuContent}
      >
        {title}
      </Trigger>
      <Content ref={contentRef} id={id} role="menu" aria-expanded={isOpen} data-position={menuHorizontalPosition}>
        {children}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--icon-size-sm) * 2);
  height: calc(var(--icon-size-sm) * 2);

  &:has(+ [aria-expanded='true']) {
    &::after {
      background-color: var(--color-gray-4A);
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Content = styled.div`
  position: absolute;
  top: 100%;
  z-index: var(--zIndex-base);
  visibility: hidden;
  min-width: max-content;
  height: fit-content;
  padding: var(--space-½);
  background-color: var(--white);
  border: 1px solid var(--color-gray-6A);
  border-radius: var(--border-radius-4);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.8);
  transition: transform 0.1s;

  &[data-position='left'] {
    left: 0;
  }

  &[data-position='right'] {
    right: 0;
  }

  &[aria-expanded='true'] {
    visibility: visible;
    opacity: 1;
    transform: scale(1);

    @starting-style {
      opacity: 0;
    }
  }

  & > * {
    display: block;
  }
`;
