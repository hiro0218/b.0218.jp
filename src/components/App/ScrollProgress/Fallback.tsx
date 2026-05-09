'use client';

import { useScrollProgressFallback } from './useScrollProgressFallback';

type Props = {
  targetId: string;
};

export function ScrollProgressFallback({ targetId }: Props) {
  useScrollProgressFallback(targetId);

  return null;
}
