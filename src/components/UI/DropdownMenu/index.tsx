'use client';

import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { styled } from '@/ui/styled/static';

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

  const toggleDropdownMenuContent = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Container ref={ref}>
      <Trigger
        aria-controls={id}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="link-style--hover-effect"
        onClick={toggleDropdownMenuContent}
        type="button"
      >
        {title}
      </Trigger>
      <Content aria-expanded={isOpen} data-position={menuHorizontalPosition} id={id} ref={contentRef} role="menu">
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
  content-visibility: hidden;
  min-width: max-content;
  height: fit-content;
  padding: var(--space-½);
  background-color: var(--white);
  border: 1px solid var(--color-gray-4A);
  border-radius: var(--border-radius-4);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.8);
  transition: transform 0.1s linear;

  &[data-position='left'] {
    left: 0;
  }

  &[data-position='right'] {
    right: 0;
  }

  &[aria-expanded='true'] {
    content-visibility: visible;
    opacity: 1;
    transform: scale(1);

    @starting-style {
      opacity: 0;
    }
  }

  & > a {
    padding: var(--space-½) var(--space-1);
    line-height: var(--line-height-lg);
    border-radius: var(--border-radius-4);
  }
`;
