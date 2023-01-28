import { useMemo } from 'react';

import { PostDate } from '@/components/Page/Post';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { Post as PostProps } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = {
  date: PostProps['date'];
  updated: PostProps['updated'];
  readingTime: PostProps['updated'];
  tags: PostProps['tags'];
};

const PostHeader = ({ date, updated, readingTime, tags }: Props) => {
  const postTags = useMemo(() => tags.map((slug) => ({ slug })), [tags]);

  return (
    <PostHeaderList>
      <PostHeaderItem>
        <PostDate date={date} updated={updated} />
        <Separator aria-hidden="true">・</Separator>
        <span>{readingTime}</span>
      </PostHeaderItem>
      <PostHeaderItem>
        <PostTagGridContainer>
          <PostTag tags={postTags} />
        </PostTagGridContainer>
      </PostHeaderItem>
    </PostHeaderList>
  );
};

export default PostHeader;

const PostHeaderList = styled.div`
  margin-top: var(--space-2);

  > * + * {
    margin-top: var(--space-1);
  }
`;

const PostHeaderItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-11);
  font-size: var(--font-size-md);
`;

const Separator = styled.span`
  margin: 0 calc(var(--space-3) * 0.25);
  user-select: none;
`;
