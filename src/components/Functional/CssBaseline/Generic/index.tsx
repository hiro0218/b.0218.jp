import 'shokika.css';

import { css } from '@/ui/styled';

/**
 * TailwindCSS の sr-only クラス実装を参考
 * @see https://tailwindcss.com/docs/screen-readers
 */
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export default css`
  #__next {
    min-height: 100%;
  }

  .sr-only {
    ${srOnly}
  }
`;
