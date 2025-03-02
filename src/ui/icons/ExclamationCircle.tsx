import type { IconProps } from './type';

/**
 * @see https://heroicons.com/mini
 */
export const ExclamationCircle = ({ color = 'currentColor', ref, ...props }: IconProps) => {
  return (
    <svg fill={color} {...props} ref={ref} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fillRule="evenodd"
      />
    </svg>
  );
};
