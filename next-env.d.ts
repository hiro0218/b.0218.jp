/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-react-svg" />

interface Window {
  twttr?: {
    widgets: {
      load: (el: HTMLElement) => void;
    };
  };
}
