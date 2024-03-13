import { css } from '@/ui/styled';

import BorderRadius from './BorderRadius';
import Color from './Color';
import Font from './Font';
import Space from './Space';
import ZIndex from './ZIndex';

export default css`
  :root {
    /**
     * color
     */
    ${Color}

    /* size */
    --container-width: 800px;

    /**
     * Font
     */
    ${Font}

    /**
     * space
     */
    ${Space}

    /**
     * border-radius
     */
    ${BorderRadius}

    /**
     * z-index
     */
    ${ZIndex}
  }
`;
