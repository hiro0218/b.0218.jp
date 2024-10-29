import Head from 'next/head';
import { type ReactElement, useEffect, useState } from 'react';

import { Container } from '@/components/Functional/Container';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import PostContentStyle from '@/pages/[post]/_components/Content/style';
import type { PageProps } from '@/types/source';

type LayoutProps = {
  slug: 'about' | 'privacy';
  title: {
    heading: string;
    paragraph: string;
  };
};

export const createGetLayout = (layoutProps: LayoutProps): (() => ReactElement) => {
  return function getLayout() {
    return <Layout {...layoutProps} />;
  };
};

function Layout({ slug, title }: LayoutProps) {
  const { heading, paragraph } = title;
  const [data, setData] = useState<PageProps>(null);

  useEffect(() => {
    (async () => {
      await fetch(`/api/pages?slug=${slug}`)
        .then((res) => res.json())
        .then((data: PageProps) => setData(data));
    })();
  }, [slug]);

  if (!data) {
    return <></>;
  }

  return (
    <Container size="small">
      <Head>
        <title key="title">{`${heading} - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/${slug}`} rel="canonical" />
      </Head>
      <Stack space={4}>
        <Title heading={heading} paragraph={paragraph} />
        <Stack as="article" space={2}>
          <div
            css={PostContentStyle}
            dangerouslySetInnerHTML={{
              __html: data.content,
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
