import Head from 'next/head';
import type { ReactElement } from 'react';

import { Container } from '@/components/Functional/Container';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Content as PostContent } from '@/pages/[post]/_components';

type LayoutProps = {
  slug: 'about' | 'privacy';
  content?: string;
  title: {
    heading: string;
    paragraph: string;
  };
};

const pages = getPagesJson();

export const createGetLayout = (layoutProps: LayoutProps): (() => ReactElement) => {
  return function getLayout() {
    return <Layout {...layoutProps} />;
  };
};

function Layout(props: LayoutProps) {
  const { content } = pages.get(props.slug);

  return (
    <Container size="small">
      <Head>
        <title key="title">{`${props.title.heading} - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/${props.slug}`} rel="canonical" />
      </Head>
      <Stack as="article" space="4">
        <Title heading={props.title.heading} paragraph={props.title.paragraph} />
        <PostContent content={content} enableMokuji={false} />
      </Stack>
    </Container>
  );
}
