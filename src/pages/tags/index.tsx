import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import Heading from '@/components/UI/Heading';
import { Columns, PageContentContainer, Stack } from '@/components/UI/Layout';
import PostTag, { Props as PostTagProps } from '@/components/UI/Tag';
import { getTermJson } from '@/lib/posts';

type TermProps = {
  tags: Array<PostTagProps>;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Tags: NextPage<Props> = ({ tags }) => {
  return (
    <>
      <header>
        <Heading text={'Tags'} />
      </header>
      <PageContentContainer>
        <Columns title={''}>
          <Stack wrap="wrap" gap="var(--space-x-xs)">
            <PostTag tags={tags} />
          </Stack>
        </Columns>
      </PageContentContainer>
    </>
  )
};

export default Tags;

export const getStaticProps: GetStaticProps<TermProps> = async () => {
  const tags = Object.entries(getTermJson('tags'))
    .map(([key, val]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]) // 件数の多い順にソート
    .map(([slug, count]) => {
      return { slug, count };
    });

  return {
    props: {
      tags,
    },
  };
};
