import Heading from '@/components/UI/Heading';
import LinkCard from '@/components/UI/LinkCard';
import { TermsPostListProps } from '@/types/source';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  heading?: string;
  posts: TermsPostListProps[];
};

const PostSimilar = ({ heading = '関連記事', posts }: Props) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <Heading as="h2" text={heading} />
      <Container>
        {posts.map(({ date, excerpt, slug, title, updated }) => (
          <LinkCard date={date} excerpt={excerpt} key={slug} link={`${slug}.html`} title={title} updated={updated} />
        ))}
      </Container>
    </section>
  );
};

export default PostSimilar;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-1)), max-content));
  gap: var(--space-1);
  margin-top: var(--space-3);

  ${isMobile} {
    grid-template-columns: minmax(100%, max-content);
    gap: var(--space-½);
  }
`;
