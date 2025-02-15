import Heading from '@/components/UI/Heading';
import { Box, Cluster } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';
import { LinkMore } from '@/pages/_components/home';
import type { JSX } from 'react';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  isWideCluster?: boolean;
  tags: PostTagProps[];
  href?: string;
  as?: keyof JSX.IntrinsicElements;
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
    <Box as={as}>
      {!!heading && (
        <Heading
          as={headingLevel}
          isWeightNormal={headingWeight === 'normal'}
          textSide={href && <LinkMore href={href} text="すべて見る" />}
        >
          {heading}
        </Heading>
      )}
      <Box mt={2}>
        <Cluster isWide={isWideCluster}>
          <PostTag tags={tags} />
        </Cluster>
      </Box>
    </Box>
  );
};
