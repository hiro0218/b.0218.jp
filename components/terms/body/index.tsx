import Head from 'next/head';
import { FC } from 'react';

import { Container } from '@/components/layout/Container';
import PageTerm from '@/components/PageTerm';
import { SITE } from '@/constant';
import { TermsPostList } from '@/types/source';

type Props = {
  type: 'Category' | 'Tag';
  title: string;
  posts: Array<TermsPostList>;
};

const TermsBody: FC<Props> = ({ type, title, posts }) => {
  return (
    <>
      <Head>
        <title key="title">
          {type}: {title} - {SITE.NAME}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <Container>
        <PageTerm posts={posts} title={title} type={type} />
      </Container>
    </>
  );
};

export default TermsBody;
