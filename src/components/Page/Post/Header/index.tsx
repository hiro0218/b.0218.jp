import PostDate from '@/components/Page/Post/Date';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { Post as PostType } from '@/types/source';
import { styled } from '@/ui/styled';

interface Props {
  post: PostType;
}

const PostHeader = ({ post }: Props) => {
  const tags = post.tags?.map((slug) => ({ slug }));

  return (
    <PostHeaderList>
      <PostHeaderItem>
        <PostDate date={post.date} updated={post.updated} />
        <PostHeaderReadingTime>{post.readingTime}</PostHeaderReadingTime>
      </PostHeaderItem>
      <PostHeaderItem>
        <PostTagGridContainer>
          <PostTag tags={tags} />
        </PostTagGridContainer>
      </PostHeaderItem>
    </PostHeaderList>
  );
};

export default PostHeader;

const PostHeaderList = styled.div`
  margin-top: var(--space-md);

  > * + * {
    margin-top: var(--space-xs);
  }
`;

const PostHeaderItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-11);
  font-size: var(--font-size-md);
`;

const PostHeaderReadingTime = styled.div`
  &::before {
    content: '・';
    margin: 0 calc(var(--margin-base) * 0.25);
  }
`;
