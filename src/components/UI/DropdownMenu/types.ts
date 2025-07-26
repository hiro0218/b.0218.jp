import type { ReactNode } from 'react';

export type DropdownMenuProps = {
  title: ReactNode;
  children: ReactNode;
  menuHorizontalPosition?: 'left' | 'right';
};
