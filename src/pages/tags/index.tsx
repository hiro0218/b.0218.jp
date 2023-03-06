import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { PageContainer, Stack } from '@/components/UI/Layout';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

type TermProps = {
  tags: PostTagProps[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Tags({ tags }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`Tags - ${SITE.NAME}`}</title>
      </Head>

      <PageContainer>
        <Title heading="Tags" paragraph={`${tags.length}件`} />
        <Stack>
          <PostTagGridContainer>
            <PostTag tags={tags} />
          </PostTagGridContainer>
        </Stack>
      </PageContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps<TermProps> = () => {
  const tags = getTagsWithCount().map(([slug, count]) => {
    return { slug, count };
  });

  return {
    props: {
      tags,
    },
  };
};
