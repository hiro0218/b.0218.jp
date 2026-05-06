import type { ReactNode } from 'react';

import { css, cx } from '@/ui/styled';
import { fontWeightClasses, headingFontSizeClasses } from '@/ui/styled/atomic/typography';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type Props = {
  id?: string;
  as?: HeadingLevel;
  children: ReactNode;
  /** 見出し右側に表示する補助テキスト（件数など） */
  textSide?: ReactNode;
  /** 見出し下部に表示する補足テキスト */
  textSub?: ReactNode;
  isBold?: boolean;
};

/**
 * セクション見出しコンポーネント。補助テキストやサブテキストを付与できる。
 * @summary セクション見出し（補助テキスト対応）
 */
export function Heading({ id, as: Tag = 'h1', children, textSide, textSub, isBold = false }: Props) {
  const titleClassName = cx(headerTitleStyle, headingFontSizeClasses[Tag], isBold && fontWeightClasses.bold);

  const title = (
    <Tag className={titleClassName} id={id}>
      {children}
    </Tag>
  );

  if (!textSide && !textSub) {
    return title;
  }

  return (
    <hgroup className={containerStyle}>
      <div className={mainStyle}>
        {title}
        {textSub ? <div className={headerSubStyle}>{textSub}</div> : null}
      </div>
      {textSide ? <div className={sideStyle}>{textSide}</div> : null}
    </hgroup>
  );
}

const containerStyle = css`
  display: flex;
  gap: var(--spacing-1);
  align-items: center;
`;

const mainStyle = css`
  flex: 1 1 auto;
`;

const headerTitleStyle = css`
  font-weight: var(--font-weights-normal);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-1000);
  letter-spacing: var(--letter-spacings-md);
  overflow-wrap: break-word;
`;

const sideStyle = css`
  color: var(--colors-gray-900);
`;

const headerSubStyle = css`
  font-weight: var(--font-weights-normal);
  color: var(--colors-gray-900);
  overflow-wrap: break-word;
`;
