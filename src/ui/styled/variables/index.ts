import { iconVariables } from './icon';
import { spaceVariables } from './space';

const globalVars = {
  ...spaceVariables,
  ...iconVariables,
  '--container-width': '800px',
};

export default globalVars;
