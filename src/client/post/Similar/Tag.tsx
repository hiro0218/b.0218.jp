import { useId } from 'react';

import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';

type Props = {
  tags: PostTagProps[];
};

function TagSimilar({ tags }: Props) {
  const labelledbyId = useId();

  if (!tags.length) {
    return null;
  }

  return (
    <Stack aria-labelledby={labelledbyId} as="aside" space="2">
      <Heading as="h2" id={labelledbyId} text="関連タグ" />
      <Stack>
        <Grid isWide={false}>
          <PostTag tags={tags} />
        </Grid>
      </Stack>
    </Stack>
  );
}

export default TagSimilar;
