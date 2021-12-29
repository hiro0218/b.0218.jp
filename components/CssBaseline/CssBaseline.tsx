import { css, Global } from '@emotion/react';

import resetStyle from './Generic';
import variableStyle from './Settings';

const globalStyle = css`
  ${variableStyle}
  ${resetStyle}
`;

const CssBaseline = () => {
  return <Global styles={globalStyle} />;
};

export default CssBaseline;
