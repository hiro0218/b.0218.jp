import { FC } from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const MenuList: FC<Props> = ({ className, children }) => {
  return (
    <div className={['l-menu-list', className].join(' ')} role="list">
      {children}
    </div>
  );
};

export const MenuListItem: FC<Props> = ({ className, children }) => {
  return (
    <div className={['l-menu-list__item', className].join(' ')} role="listitem">
      {children}
    </div>
  );
};
