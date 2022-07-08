import Heading from '@/components/UI/Heading';
import LinkCard from '@/components/UI/LinkCard';
import { mobile } from '@/lib/mediaQuery';
import { TermsPostList } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = {
  posts: TermsPostList[];
};

export const PostNextRead = ({ posts }: Props) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="next-read">
      <Heading tagName="h2" text={'Next Read'} isWeightNormal={false} />
      <Container>
        {posts.map((post, index) => (
          <LinkCard key={index} link={`${post.slug}.html`} title={post.title} date={post.date} excerpt={post.excerpt} />
        ))}
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-md)), 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);

  ${mobile} {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;
