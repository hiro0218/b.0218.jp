import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { READ_TIME_SUFFIX } from '@/constant';
import type { PostProps } from '@/types/source';
import { styled } from '@/ui/styled';

import PostDate from '../Date';

type Props = Pick<PostProps, 'title' | 'date' | 'updated' | 'readingTime'> & {
  tagsWithCount: PostTagProps[];
};

function PostHeader({ title, date, updated, readingTime, tagsWithCount }: Props) {
  return (
    <>
      <Title dangerouslySetInnerHTML={{ __html: title }}></Title>
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
    </>
  );
}

export default PostHeader;

const Title = styled.h1`
  font-weight: var(--font-weight-bolder);
`;

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
