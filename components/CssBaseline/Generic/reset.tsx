import { css } from '@emotion/react';
import resetCSS from 'shokika.css/dist/string';

export default css`
  ${resetCSS}

  #__next {
    height: 100%;
    isolation: isolate;
  }
`;
