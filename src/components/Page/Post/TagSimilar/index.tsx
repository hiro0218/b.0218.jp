import Heading from '@/components/UI/Heading';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { styled } from '@/ui/styled';

type Props = {
  similarTags: PostTagProps[];
};

const TagSimilar = ({ similarTags }: Props) => {
  if (!similarTags.length) {
    return null;
  }

  return (
    <section>
      <Heading as="h2" text="関連タグ" />
      <Container>
        <PostTagGridContainer>
          <PostTag tags={similarTags} />
        </PostTagGridContainer>
      </Container>
    </section>
  );
};

export default TagSimilar;

const Container = styled.div`
  margin-top: var(--space-3);
`;
