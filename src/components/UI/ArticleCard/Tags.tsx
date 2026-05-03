import { styled } from '@/ui/styled';
import { postTagAnchor } from '@/ui/styled/components/postTagAnchor';

type Props = {
  tags: string[];
};

export function Tags({ tags }: Props) {
  return (
    <Container>
      {tags.map((tag) => (
        <TagItem className={postTagAnchor} key={tag}>
          {tag}
        </TagItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: var(--spacing-1);
  margin-top: auto;
  overflow: clip;
  mask-image: linear-gradient(to right, transparent, black 0, black calc(100% - 2em), transparent);

  @container (max-width: 480px) {
    display: none;
  }
`;

const TagItem = styled.span`
  padding: var(--spacing-½) var(--spacing-1);
  font-size: var(--font-sizes-xs);
  border-radius: var(--radii-sm);
`;
