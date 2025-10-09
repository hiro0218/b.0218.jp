import type { ReactNode } from 'react';
import { type CSSProperties, useMemo } from 'react';

import { css } from '@/ui/styled';

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
  const titleStyle = {
    ...(!isWeightNormal && { '--font-weight': 'var(--font-weights-bold)' }),
  } as CSSProperties;

  const fontSizeLevel = (() => {
    switch (TitleTag) {
      case 'h1':
      case 'h2':
        return 4;
      default:
        return 5;
    }
  })();

  const TitleComponent = useMemo(
    () => (
      <TitleTag className={headerTitleStyle} data-font-size-h={fontSizeLevel} id={id} style={titleStyle}>
        {children}
      </TitleTag>
    ),
    [TitleTag, children, id, fontSizeLevel, titleStyle],
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
  align-items: center;
`;

const mainStyle = css`
  flex: 1 1;
`;

const headerTitleStyle = css`
  font-weight: var(--font-weight, --font-weights-normal);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-12);
  overflow-wrap: break-word;
`;

const sideStyle = css`
  color: var(--colors-gray-11);
`;

const headerSubStyle = css`
  margin-top: var(--spacing-1);
  font-weight: var(--font-weights-normal);
  color: var(--colors-gray-11);
  overflow-wrap: break-word;
`;
