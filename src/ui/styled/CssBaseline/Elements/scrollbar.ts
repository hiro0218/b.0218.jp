import { css } from '@/ui/styled';

export const Scrollbar = css`
  // Firefox
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--solid-backgrounds-9) var(--component-backgrounds-3A);
  }

  // Chrome, Edge and Safari
  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background-color: var(--component-backgrounds-3A);
    border-radius: 4px;
  }

  *::-webkit-scrollbar-track:hover {
    background-color: var(--component-backgrounds-4A);
  }

  *::-webkit-scrollbar-track:active {
    background-color: var(--component-backgrounds-5A);
  }

  *::-webkit-scrollbar-thumb {
    background-color: var(--solid-backgrounds-9);
    background-clip: content-box;
    border: 1px solid transparent;
    border-radius: 4px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: var(--solid-backgrounds-10);
  }

  *::-webkit-scrollbar-thumb:active {
    background-color: var(--solid-backgrounds-10);
  }
`;
