import 'shokika.css';

import { css } from '@/ui/styled';

export const srOnly = css`
  /* stylelint-disable indentation */
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border-width: 0;
  white-space: nowrap;
`;

export default css`
  #__next {
    min-height: 100%;
  }

  .sr-only {
    ${srOnly}
  }
`;
