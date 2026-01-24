'use client';

import { useScrollRestorer } from 'next-scroll-restorer';

export const ClientSideScrollRestorer = () => {
  useScrollRestorer();
  return null;
};
