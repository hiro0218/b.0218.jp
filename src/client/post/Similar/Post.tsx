import Heading from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import type { TermsPostListProps } from '@/types/source';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  heading?: string;
  posts: TermsPostListProps[];
};

function PostSimilar({ heading = '関連記事', posts }: Props) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <Stack as="aside" space="2">
      <Heading as="h2" text={heading} />
      <Container>
        {posts.map(({ date, slug, title, updated }) => (
          <LinkCard date={date} key={slug} link={`${slug}.html`} title={title} updated={updated} />
        ))}
      </Container>
    </Stack>
  );
}

export default PostSimilar;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-1)), max-content));
  gap: var(--space-1);

  ${isMobile} {
    grid-template-columns: minmax(100%, max-content);
    gap: var(--space-½);
  }
`;
