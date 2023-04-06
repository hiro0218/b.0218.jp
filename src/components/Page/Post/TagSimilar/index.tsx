import Heading from '@/components/UI/Heading';
import PostTag, { Props as PostTagProps } from '@/components/UI/Tag';
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
        <PostTag tags={similarTags} />
      </Container>
    </section>
  );
};

export default TagSimilar;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: var(--space-3);
`;
