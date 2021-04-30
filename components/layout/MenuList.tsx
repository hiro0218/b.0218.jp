import { FC } from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const MenuList: FC<Props> = ({ className, children }) => {
  return <div className={['l-menu-list', className].join(' ')}>{children}</div>;
};

export const MenuListItem: FC<Props> = ({ className, children }) => {
  return <div className={['l-menu-list__item', className].join(' ')}>{children}</div>;
};
