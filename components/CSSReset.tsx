import { css, Global } from '@emotion/react';
import resetCSS from 'shokika.css/dist/string';

const globalStyle = css`
  ${resetCSS}
`;

export const CSSReset = () => <Global styles={globalStyle} />;
