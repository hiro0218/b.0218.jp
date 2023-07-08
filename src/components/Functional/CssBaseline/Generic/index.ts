import reset from 'shokika.css/dist/string';

import { css } from '@/ui/styled';

export const SrOnlyClassName = 'sr-only';

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

/**
 * @see https://tailwindcss.com/docs/screen-readers
 */
export const notSrOnly = css`
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
`;

export default css`
  ${reset}

  #__next {
    min-height: 100%;
  }

  .${SrOnlyClassName} {
    ${srOnly}
  }
`;
