import { easingVariables } from './easing';
import { fontVariables } from './font';
import { iconVariables } from './icon';
import { spaceVariables } from './space';

const globalVars = {
  ...fontVariables,
  ...spaceVariables,
  ...easingVariables,
  ...iconVariables,
};

export default globalVars;
