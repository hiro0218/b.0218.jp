import PostDate from '@/components/Page/Post/Date';
import Heading from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { Post as PostType } from '@/types/source';
import { styled } from '@/ui/styled';

interface Props {
  post: PostType;
}

const PostHeader = ({ post }: Props) => {
  const tags = post.tags?.map((slug) => ({ slug }));

  return (
    <Stack space="var(--space-xs)">
      <PostHeaderItem>
        <Heading text={post.title} />
      </PostHeaderItem>
      <PostHeaderItem>
        <PostDate date={post.date} updated={post.updated} />
        <PostHeaderReadingTime>{post.readingTime}</PostHeaderReadingTime>
      </PostHeaderItem>
      <PostHeaderItem>
        <PostTagGridContainer>
          <PostTag tags={tags} />
        </PostTagGridContainer>
      </PostHeaderItem>
    </Stack>
  );
};

export default PostHeader;

const PostHeaderItem = styled.div`
  display: flex;
  align-items: center;
`;

const PostHeaderReadingTime = styled.div`
  color: var(--text-11);
  font-size: var(--font-size-md);

  &::before {
    content: '・';
    margin: 0 calc(var(--margin-base) * 0.25);
  }
`;
