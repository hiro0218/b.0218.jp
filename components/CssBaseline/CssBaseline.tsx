import { css, Global } from '@emotion/react';

import elementStyle from './Elements';
import resetStyle from './Generic';
import variableStyle from './Settings';
import vendorStyle from './Vendor';

const globalStyle = css`
  ${variableStyle}
  ${resetStyle}
  ${elementStyle}
  ${vendorStyle}
`;

const CssBaseline = () => {
  return <Global styles={globalStyle} />;
};

export default CssBaseline;
