import Heading from '@/components/UI/Heading';
import { Cluster, Stack } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';
import { LinkMore } from '@/pages/_components/home';
import type { ElementType } from 'react';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  isWideCluster?: boolean;
  tags: PostTagProps[];
  href?: string;
  as?: ElementType;
};

export const TagSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  headingWeight = 'normal',
  tags,
  href,
  isWideCluster = true,
}: Props) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <Stack as={as} space={2}>
      {!!heading && (
        <Heading
          as={headingLevel}
          isWeightNormal={headingWeight === 'normal'}
          text={heading}
          textSide={href && <LinkMore href={href} text="すべて見る" />}
        />
      )}
      <Stack>
        <Cluster isWide={isWideCluster}>
          <PostTag tags={tags} />
        </Cluster>
      </Stack>
    </Stack>
  );
};
