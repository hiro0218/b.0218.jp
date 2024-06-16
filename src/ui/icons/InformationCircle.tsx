import { forwardRef } from 'react';

import type { IconProps } from './type';

export const InformationCircle = forwardRef<SVGSVGElement, IconProps>(function ExclamationTriangle(
  { color = 'currentColor', ...props },
  forwardedRef,
) {
  return (
    <svg fill={color} {...props} ref={forwardedRef} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
        fillRule="evenodd"
      />
    </svg>
  );
});
