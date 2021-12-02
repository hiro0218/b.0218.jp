import { css, cx } from '@emotion/css';
import React, { CSSProperties, memo } from 'react';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  style?: CSSProperties;
  children?: React.ReactNode;
}

const cssContainer = css`
  max-width: var(--container-width);
  margin: var(--margin-base) auto 0;
  transition: padding 0.1s ease-in-out;

  @media (max-width: 959px) {
    padding: 0 5vw;
  }
`;

export const Container = memo(function Container(props: ContainerProps) {
  const { children, ...others } = props;

  return (
    <div className={cx('l-container', cssContainer)} {...others}>
      {children}
    </div>
  );
});
