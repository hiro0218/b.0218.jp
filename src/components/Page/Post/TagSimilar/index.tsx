import Heading from '@/components/UI/Heading';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';
import { styled } from '@/ui/styled';

type Props = {
  tags: PostTagProps[];
};

const TagSimilar = ({ tags }: Props) => {
  if (!tags.length) {
    return null;
  }

  return (
    <section>
      <Heading as="h2" text="関連タグ" />
      <Container>
        <PostTag tags={tags} />
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
