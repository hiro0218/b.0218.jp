import 'shokika.css';

import { css } from '@/ui/styled';

/**
 * TailwindCSS の sr-only クラス実装を参考
 * @see https://tailwindcss.com/docs/screen-readers
 */
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
