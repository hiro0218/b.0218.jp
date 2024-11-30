import { BREAKPOINT } from '@/constant';

// Media Queries
const isMobile = `@media (max-width: ${BREAKPOINT - 1}px)`;
const isDesktop = `@media (min-width: ${BREAKPOINT}px)`;

// Container Queries
const isContainer = {
  '@xs': '@container (min-width: 20rem)', // 320px
  '@sm': '@container (min-width: 24rem)', // 384px
  '@md': '@container (min-width: 28rem)', // 448px
  '@lg': '@container (min-width: 32rem)', // 512px
  '@xl': '@container (min-width: 36rem)', // 576px
  '@2xl': '@container (min-width: 42rem)', // 672px
  '@3xl': '@container (min-width: 48rem)', // 768px
  '@4xl': '@container (min-width: 56rem)', // 896px
  '@5xl': '@container (min-width: 64rem)', // 1024px
  '@6xl': '@container (min-width: 72rem)', // 1152px
  '@7xl': '@container (min-width: 80rem)', // 1280px
};

export { isDesktop, isMobile, isContainer };
