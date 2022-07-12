import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import { Columns, PageContentContainer } from '@/components/UI/Layout';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { Title } from '@/components/UI/Title';
import { getTermWithCount } from '@/lib/posts';

type TermProps = {
  tags: Array<PostTagProps>;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Tags: NextPage<Props> = ({ tags }) => (
  <PageContentContainer>
    <Title heading="Tags" />
    <Columns>
      <PostTagGridContainer>
        <PostTag tags={tags} />
      </PostTagGridContainer>
    </Columns>
  </PageContentContainer>
);

export default Tags;

export const getStaticProps: GetStaticProps<TermProps> = async () => {
  const tags = getTermWithCount('tags').map(([slug, count]) => {
    return { slug, count };
  });

  return {
    props: {
      tags,
    },
  };
};
