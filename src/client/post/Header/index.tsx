import PostDate from '@/components/UI/Date';
import { Stack } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { READ_TIME_SUFFIX } from '@/constant';
import type { PostProps } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = Pick<PostProps, 'title' | 'date' | 'updated' | 'readingTime'> & {
  tagsWithCount: PostTagProps[];
};

function PostHeader({ title, date, updated, readingTime, tagsWithCount }: Props) {
  return (
    <Stack as="header" space="2">
      <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
      <Stack space="1">
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
      </Stack>
    </Stack>
  );
}

export default PostHeader;

const Item = styled.div`
  display: flex;
  color: var(--text-11);
`;

const Separator = styled.span`
  margin: 0 calc(var(--space-3) * 0.25);
  user-select: none;
`;
