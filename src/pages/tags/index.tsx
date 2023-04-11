import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { PageContainer, Stack } from '@/components/UI/Layout';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { Title } from '@/components/UI/Title';
import { SITE, TAG_VIEW_LIMIT } from '@/constant';
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
        <link href={`${SITE.URL}tags`} rel="canonical" />
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
  const tags = getTagsWithCount()
    .map(([slug, count]) => {
      return count >= TAG_VIEW_LIMIT ? { slug, count } : null;
    })
    .filter((tag) => tag !== null);

  return {
    props: {
      tags,
    },
  };
};
