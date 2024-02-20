import dynamic from 'next/dynamic';
import { type ComponentProps, useMemo } from 'react';

import Heading from '@/components/UI/Heading';

import { LinkMore } from './LinkMore';

const SrOnly = dynamic(() =>
  import('@/components/UI/ScreenReaderOnlyText').then((module) => module.ScreenReaderOnlyText),
);

type Props = {
  text: string;
  as?: ComponentProps<typeof Heading>['as'];
  href?: ComponentProps<typeof LinkMore>['href'];
  isBold?: ComponentProps<typeof Heading>['isWeightNormal'];
};

export const TitleSection = ({ as = 'h2', text, href, isBold = true }: Props) => {
  const Link = useMemo(
    () =>
      !!href ? (
        <LinkMore
          href={href}
          text={
            <>
              <SrOnly text={text} />
              一覧
            </>
          }
        />
      ) : undefined,
    [href, text],
  );

  return <Heading as={as} isWeightNormal={isBold} text={text} textSide={Link} />;
};
