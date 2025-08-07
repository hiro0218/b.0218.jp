import { fontVariables } from './font';
import { iconVariables } from './icon';
import { spaceVariables } from './space';

const globalVars = {
  ...fontVariables,
  ...spaceVariables,
  ...iconVariables,
  '--container-width': '800px',
};

export default globalVars;
