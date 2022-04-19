import resetCSS from 'shokika.css/dist/string';

import { css } from '@/ui/styled';

export default css`
  ${resetCSS}

  #__next {
    height: 100%;
    isolation: isolate;
  }
`;
