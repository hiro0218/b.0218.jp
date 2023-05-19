import Head from 'next/head';
import type { PropsWithChildren, ReactElement } from 'react';

import { PageContainer } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';

type LayoutProps = {
  head: {
    title: string;
  };
  content?: string;
  title: {
    heading: string;
    paragraph: string;
  };
};

export const createGetLayout = (layoutProps: LayoutProps): ((children: ReactElement) => ReactElement) => {
  return function getLayout(children: ReactElement) {
    return <Layout {...layoutProps}>{children}</Layout>;
  };
};

const Layout = ({ children, ...props }: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <Head>
        <title key="title">{props.head.title}</title>
      </Head>
      <PageContainer as="article">
        <Title heading={props.title.heading} paragraph={props.title.paragraph} />
        {children}
      </PageContainer>
    </>
  );
};
