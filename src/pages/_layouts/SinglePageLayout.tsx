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

function Layout({ slug, title }: LayoutProps) {
  const { content } = pages.get(slug);
  const { heading, paragraph } = title;

  return (
    <Container size="small">
      <Head>
        <title key="title">{`${heading} - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/${slug}`} rel="canonical" />
      </Head>
      <Stack as="article" space="4">
        <Title heading={heading} paragraph={paragraph} />
        <PostContent content={content} enableMokuji={false} />
      </Stack>
    </Container>
  );
}
