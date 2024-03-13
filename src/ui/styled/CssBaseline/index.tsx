import { css, Global } from '@/ui/styled';

import elementStyle from './Elements';
import resetStyle from './Generic';
import variableStyle from './Settings';

const globalStyle = css`
  ${variableStyle}
  ${resetStyle}
  ${elementStyle}
`;

function CssBaseline() {
  return <Global styles={globalStyle} />;
}

export default CssBaseline;
