import Head from 'next/head';
import type { ReactElement } from 'react';

// eslint-disable-next-line strict-dependencies/strict-dependencies
import * as Post from '@/client/post';
import { PageContainer } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPagesJson } from '@/lib/posts';

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
  const { content } = pages.find((page) => page.slug === props.slug);

  return (
    <>
      <Head>
        <title key="title">{`${props.title.heading} - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/${props.slug}`} rel="canonical" />
      </Head>
      <PageContainer as="article">
        <Title heading={props.title.heading} paragraph={props.title.paragraph} />
        <Post.Content content={content} enableMokuji={false} />
      </PageContainer>
    </>
  );
}
