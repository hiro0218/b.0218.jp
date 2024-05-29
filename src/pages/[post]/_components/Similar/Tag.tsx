import Heading from '@/components/UI/Heading';
import { Cluster, Stack } from '@/components/UI/Layout';
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
    <Stack as="aside" space={2}>
      <Heading as="h2" isWeightNormal={false} text="関連タグ" />
      <Stack>
        <Cluster isWide={false}>
          <PostTag tags={tags} />
        </Cluster>
      </Stack>
    </Stack>
  );
}

export default TagSimilar;
