import type { ComponentProps } from 'react';

import Heading from '@/components/UI/Heading';

import { LinkMore } from '../LinkMore';

type Props = {
  text: string;
  as?: ComponentProps<typeof Heading>['as'];
  href?: ComponentProps<typeof LinkMore>['href'];
};

export const TitleSection = ({ as = 'h2', text, href }: Props) => {
  return <Heading as={as} text={text} textSide={!!href && <LinkMore href={href} text="一覧" />} />;
};
