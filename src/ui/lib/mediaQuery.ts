import { BREAKPOINT } from '@/constant';

const isMobile = `@media (max-width: ${BREAKPOINT - 1}px)`;
const isDesktop = `@media (min-width: ${BREAKPOINT}px)`;

export { isDesktop, isMobile };
