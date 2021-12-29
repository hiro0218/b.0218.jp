import { css, Global } from '@emotion/react';

import elementStyle from './Elements';
import resetStyle from './Generic';
import variableStyle from './Settings';

const globalStyle = css`
  ${variableStyle}
  ${resetStyle}
  ${elementStyle}
`;

const CssBaseline = () => {
  return <Global styles={globalStyle} />;
};

export default CssBaseline;
