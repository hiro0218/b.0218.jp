import type { JSX } from 'react';
import type { PostTagItem } from '@/components/Page/_shared/Tag';
import { PostTag } from '@/components/Page/_shared/Tag';
import { Heading, type HeadingLevel } from '@/components/UI/Heading';
import { Cluster } from '@/components/UI/Layout/Cluster';
import { Stack } from '@/components/UI/Layout/Stack';
import { LinkMore } from '@/components/UI/LinkMore';

type Props = {
  heading?: string;
  headingLevel?: Exclude<HeadingLevel, 'h1'>;
  isWideCluster?: boolean;
  tags: PostTagItem[];
  href?: string;
  as?: keyof JSX.IntrinsicElements;
};

export const TagSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  tags,
  href,
  isWideCluster = true,
}: Props) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <Stack as={as} gap={500}>
      {!!heading && (
        <Heading as={headingLevel} isBold textSide={href && <LinkMore href={href} text="すべて見る" />}>
          {heading}
        </Heading>
      )}
      <Cluster isWide={isWideCluster}>
        <PostTag size="pill" tags={tags} />
      </Cluster>
    </Stack>
  );
};
