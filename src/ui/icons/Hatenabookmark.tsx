import type { SVGAttributes } from 'react';
import { forwardRef } from 'react';

interface IconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}

export const Hatenabookmark = forwardRef<SVGSVGElement, IconProps>(function Hatenabookmark(
  { color = 'currentColor', ...props },
  forwardedRef,
) {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={forwardedRef}
    >
      <path
        d="M5 2C3.348 2 2 3.348 2 5v14c0 1.652 1.348 3 3 3h14c1.652 0 3-1.348 3-3V5c0-1.652-1.348-3-3-3Zm0 2h14c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1Zm2 3v10h2.625c1.016 0 1.617-.082 2.063-.156.445-.078.851-.196 1.156-.375.375-.219.644-.567.844-.969.203-.402.312-.844.312-1.375 0-.734-.172-1.309-.531-1.75-.356-.441-.832-.695-1.469-.75.566-.172.926-.414 1.188-.75.257-.328.406-.781.406-1.344 0-.445-.078-.847-.25-1.187a2.03 2.03 0 0 0-.75-.813c-.29-.176-.664-.3-1.063-.375C11.13 7.086 10.633 7 9.625 7Zm8 0v7h2V7ZM9 9h.625c.691 0 1.137.098 1.375.25s.375.41.375.781c0 .36-.152.602-.406.75-.258.145-.688.219-1.375.219H9Zm0 4h1c.648 0 1.074.066 1.313.219.242.152.406.457.406.844a.83.83 0 0 1-.438.75c-.261.148-.68.187-1.312.187H9Zm7 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1Z"
        fill={color}
      />
    </svg>
  );
});
