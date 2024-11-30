import type { ReactElement, ReactNode } from 'react';

import { Container, getSize } from '@/components/Functional/Container';

type LayoutProps = {
  children?: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
  const size = getSize('default');
  return <Container size={size}>{children}</Container>;
};

export const createGetLayout = (layoutProps?: LayoutProps): ((page: ReactElement) => ReactNode) => {
  return function getLayout(page: ReactElement) {
    return <Layout {...layoutProps}>{page}</Layout>;
  };
};
