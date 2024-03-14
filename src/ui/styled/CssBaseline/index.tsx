import { css, Global } from '@/ui/styled';
import { SrOnlyClassName } from '@/ui/styled/constant';

import elementStyle from './Elements';
import resetStyle from './Generic';
import variableStyle from './Settings';
import { srOnly } from './Utilities';

const globalStyle = css`
  ${variableStyle}
  ${resetStyle}
  ${elementStyle}

  .${SrOnlyClassName} {
    ${srOnly}
  }
`;

function CssBaseline() {
  return <Global styles={globalStyle} />;
}

export default CssBaseline;
