import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';

type Props = {
  tags: PostTagProps[];
};

function TagSimilar({ tags }: Props) {
  if (!tags.length) {
    return null;
  }

  return (
    <Stack as="section" space="2">
      <Heading as="h2" text="関連タグ" />
      <Stack>
        <Grid isWide={false}>
          <PostTag tags={tags} />
        </Grid>
      </Stack>
    </Stack>
  );
}

export default TagSimilar;
