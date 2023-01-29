import Heading from '@/components/UI/Heading';
import LinkCard from '@/components/UI/LinkCard';
import { TermsPostList } from '@/types/source';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  posts: TermsPostList[];
};

const PostNextRead = ({ posts }: Props) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <Heading as="h2" text="Related Articles" />
      <Container>
        {posts.map((post) => (
          <LinkCard
            key={post.slug}
            link={`${post.slug}.html`}
            title={post.title}
            date={post.date}
            excerpt={post.excerpt}
          />
        ))}
      </Container>
    </section>
  );
};

export default PostNextRead;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-1)), max-content));
  gap: var(--space-1);
  margin-top: var(--space-3);

  ${isMobile} {
    grid-template-columns: minmax(100%, max-content);
    gap: var(--space-half);
  }
`;
