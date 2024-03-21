import type { ReactElement, ReactNode } from 'react';

import { Container } from '@/components/Functional/Container';

type LayoutProps = {
  children?: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
  return <Container size="small">{children}</Container>;
};

export const createGetLayout = (layoutProps?: LayoutProps): ((page: ReactElement) => ReactNode) => {
  return function getLayout(page: ReactElement) {
    return <Layout {...layoutProps}>{page}</Layout>;
  };
};
