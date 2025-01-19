import { colorVariables } from './color';
import { easingVariables } from './easing';
import { fontVariables } from './font';
import { iconVariables } from './icon';
import { spaceVariables } from './space';

const globalVars = {
  ...fontVariables,
  ...spaceVariables,
  ...colorVariables,
  ...easingVariables,
  ...iconVariables,
};

export default globalVars;
