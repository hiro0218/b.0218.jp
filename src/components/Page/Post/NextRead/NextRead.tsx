import Heading from '@/components/UI/Heading';
import LinkCard from '@/components/UI/LinkCard';
import { TermsPostList } from '@/types/source';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  posts: TermsPostList[];
};

export const PostNextRead = ({ posts }: Props) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <Heading tagName="h2" text="Related Articles" isWeightNormal={false} />
      <Container>
        {posts.map((post, index) => (
          <LinkCard key={index} link={`${post.slug}.html`} title={post.title} date={post.date} excerpt={post.excerpt} />
        ))}
      </Container>
    </section>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-md)), max-content));
  gap: var(--space-md);
  margin-top: var(--space-md);

  ${isMobile} {
    grid-template-columns: minmax(100%, max-content);
    gap: var(--space-sm);
  }
`;
