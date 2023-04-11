import { PostDate } from '@/components/Page/Post';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { READ_TIME_SUFFIX } from '@/constant';
import { Post as PostProps } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = Pick<PostProps, 'date' | 'updated' | 'readingTime'> & {
  tagsWithCount: PostTagProps[];
};

const PostHeader = ({ date, updated, readingTime, tagsWithCount }: Props) => {
  return (
    <List>
      <Item>
        <PostDate date={date} updated={updated} />
        <Separator aria-hidden="true">・</Separator>
        <span>{`${readingTime || 1} ${READ_TIME_SUFFIX}`}</span>
      </Item>
      <Item>
        <PostTagGridContainer>
          <PostTag tags={tagsWithCount} />
        </PostTagGridContainer>
      </Item>
    </List>
  );
};

export default PostHeader;

const List = styled.div`
  margin-top: var(--space-2);

  > * + * {
    margin-top: var(--space-1);
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-md);
  color: var(--text-11);
`;

const Separator = styled.span`
  margin: 0 calc(var(--space-3) * 0.25);
  user-select: none;
`;
