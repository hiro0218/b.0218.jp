'use client';

import { Suspense } from 'react';
import { PaginationCore } from './PaginationCore';

type PaginationProps = {
  totalItems: number;
};

export function Pagination({ totalItems }: PaginationProps) {
  return (
    <Suspense fallback={null}>
      <PaginationCore totalItems={totalItems} />
    </Suspense>
  );
}
