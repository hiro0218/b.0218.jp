import type { ReactNode } from 'react';
import { Box } from '@/components/UI/Layout';

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box as="main" mt={3}>
      {children}
    </Box>
  );
};
