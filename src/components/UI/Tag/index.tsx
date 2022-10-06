import { Anchor } from '@/components/UI/Anchor';
import { styled } from '@/ui/styled';

export type Props = {
  slug: string;
  count?: number;
};

type PostTagProps = {
  tags: Array<Props>;
};

const PostTag = ({ tags }: PostTagProps) => {
  if (tags?.length === 0) {
    return null;
  }

  return (
    <>
      {tags?.map(({ slug, count }, index) => (
        <Anchor href={'/tags/' + slug} prefetch={false} passHref key={index}>
          <PostTagAnchor title={count ? `${slug}: ${count}件` : 'tag: ' + slug}>{slug}</PostTagAnchor>
        </Anchor>
      ))}
    </>
  );
};

export default PostTag;

export const PostTagGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-x-xs);
`;

const PostTagAnchor = styled.a`
  flex: 1 1 auto;
  align-items: center;
  align-self: flex-start;
  padding: 0 0.5em;
  border-radius: 0.15rem;
  background-color: var(--component-backgrounds-3);
  color: var(--text-11);
  text-align: center;
  white-space: nowrap;

  &:hover,
  &:focus {
    background-color: var(--component-backgrounds-5);
  }

  &::before {
    content: '#';
  }
`;
