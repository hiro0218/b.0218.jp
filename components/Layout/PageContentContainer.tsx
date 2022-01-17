import { css } from '@emotion/react';
import React, { CSSProperties, memo } from 'react';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const PageContentContainer = memo(function Container(props: ContainerProps) {
  const { children, ...others } = props;

  return (
    <div className="l-page-content-container" css={cssContainer} {...others}>
      {children}
    </div>
  );
});

const cssContainer = css`
  margin-top: var(--space-md);

  > * + * {
    margin-top: var(--space-lg);
  }
`;
