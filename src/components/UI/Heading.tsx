import type { ReactNode } from 'react';

import { Stack } from '@/components/UI/Layout/Stack';
import { css, cx } from '@/ui/styled';
import { fontWeightClasses, headingFontSizeClasses } from '@/ui/styled/atomic/typography';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type Props = {
  id?: string;
  as?: HeadingLevel;
  children: ReactNode;
  /** 見出し右側に表示する補助テキスト（件数など） */
  textSide?: ReactNode;
  isBold?: boolean;
  className?: string;
  /** ハッシュリンクの着地先にする場合は -1 を指定する（Next.js のハッシュ遷移後の focus() を有効にするため） */
  tabIndex?: number;
};

/**
 * @summary セクション見出し（補助テキスト対応）
 */
export function Heading({ className, id, as: Tag = 'h1', children, textSide, isBold = false, tabIndex }: Props) {
  // normal に bold を重ねず、1 つだけ選ぶ。重ねると、同じ font-weight を持つ 2 つの class のうち、勝つ方が CSS の出力順で決まる
  const titleClassName = cx(
    headerTitleStyle,
    headingFontSizeClasses[Tag],
    fontWeightClasses[isBold ? 'bold' : 'normal'],
  );

  const title = (
    <Tag className={cx(className, titleClassName)} id={id} tabIndex={tabIndex}>
      {children}
    </Tag>
  );

  if (!textSide) {
    return title;
  }

  return (
    <Stack align="center" as="hgroup" direction="horizontal" gap={100}>
      <div className={mainStyle}>{title}</div>
      <div className={sideStyle}>{textSide}</div>
    </Stack>
  );
}

const mainStyle = css`
  flex: 1 1 auto;
`;

const headerTitleStyle = css`
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-1000);
  letter-spacing: var(--letter-spacings-md);
  overflow-wrap: break-word;
`;

const sideStyle = css`
  color: var(--colors-gray-600);
`;
