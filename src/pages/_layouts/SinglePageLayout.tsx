import Head from 'next/head';
import type { ReactElement } from 'react';

import { Container, getSize } from '@/components/Functional/Container';
import { Box } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { parser } from '@/pages/[post]/_components/Content/inject';
import PostContentStyle from '@/pages/[post]/_components/Content/style';
import { MainContainer } from '@/pages/_components/MainContainer';
import { cx } from '@/ui/styled/static';

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
  const reactNodeContent = parser(content);
  const { heading, paragraph } = title;
  const size = getSize('small');

  return (
    <MainContainer>
      <Container size={size}>
        <Head>
          <title key="title">{`${heading} - ${SITE_NAME}`}</title>
          <link href={`${SITE_URL}/${slug}`} rel="canonical" />
        </Head>
        <section>
          <Title heading={heading} paragraph={paragraph} />
          <Box as="article" mt={4} className={cx('post-content')}>
            <div css={PostContentStyle}>{reactNodeContent}</div>
          </Box>
        </section>
      </Container>
    </MainContainer>
  );
}
