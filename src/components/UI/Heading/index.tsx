import type { ReactNode } from 'react';

import { css, cx } from '@/ui/styled';
import { fontWeightClasses, headingFontSizeClasses } from '@/ui/styled/atomic';

type Props = {
  id?: HTMLHeadingElement['id'];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
  textSide?: ReactNode;
  textSub?: ReactNode;
  isWeightNormal?: boolean;
};

function Heading({
  id = undefined,
  as: TitleTag = 'h1',
  children,
  textSide = undefined,
  textSub = undefined,
  isWeightNormal = true,
}: Props) {
  const TitleComponent = (
    <TitleTag
      className={cx(headerTitleStyle, headingFontSizeClasses[TitleTag], !isWeightNormal && fontWeightClasses.bold)}
      id={id}
    >
      {children}
    </TitleTag>
  );

  const hasTextSub = !!textSub;
  const hasTextSide = !!textSide;

  return (
    <>
      {hasTextSub || hasTextSide ? (
        <hgroup className={containerStyle}>
          <div className={mainStyle}>
            {TitleComponent}
            {hasTextSub && <div className={headerSubStyle}>{textSub}</div>}
          </div>
          {hasTextSide && <div className={sideStyle}>{textSide}</div>}
        </hgroup>
      ) : (
        <>{TitleComponent}</>
      )}
    </>
  );
}

export default Heading;

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
