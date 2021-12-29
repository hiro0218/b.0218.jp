import { css, Global } from '@emotion/react';
import resetCSS from 'shokika.css/dist/string';

const globalStyle = css`
  ${resetCSS}
`;

const CssBaseline = () => {
  return <Global styles={globalStyle} />;
};

export default CssBaseline;
