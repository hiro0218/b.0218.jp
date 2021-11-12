import Head from 'next/head';
import { FC } from 'react';

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

      <PageTerm posts={posts} title={title} type={type} />
    </>
  );
};

export default TermsBody;
