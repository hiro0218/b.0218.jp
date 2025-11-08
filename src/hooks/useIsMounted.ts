'use client';
'use no memo';

import { useEffect } from 'react';
import { useBoolean } from './useBoolean';

export default function useIsMounted(): boolean {
  const { value: isMounted, setTrue, setFalse } = useBoolean(false);

  useEffect(() => {
    setTrue();

    return () => {
      setFalse();
    };
  }, [setTrue, setFalse]);

  return isMounted;
}
