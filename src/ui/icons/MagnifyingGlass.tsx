import type { IconProps } from './type';

/**
 * @see https://heroicons.com/mini
 */
export const MagnifyingGlass = ({ color = 'currentColor', ref, ...props }: IconProps) => {
  return (
    <svg fill={color} ref={ref} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        clipRule="evenodd"
        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        fillRule="evenodd"
      />
    </svg>
  );
};
