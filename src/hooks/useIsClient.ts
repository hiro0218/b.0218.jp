'use client';

import { useEffect } from 'react';

import { useBoolean } from './useBoolean';

function useIsClient(): boolean {
  const { value: isClient, setTrue } = useBoolean(false);

  useEffect(() => {
    setTrue();
  }, [setTrue]);

  return isClient;
}

export default useIsClient;
