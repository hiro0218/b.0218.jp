import { css, Global } from '@emotion/react';

import resetStyle from './Generic/reset';
import variableStyle from './Settings/variables';

const globalStyle = css`
  ${variableStyle}
  ${resetStyle}
`;

const CssBaseline = () => {
  return <Global styles={globalStyle} />;
};

export default CssBaseline;
