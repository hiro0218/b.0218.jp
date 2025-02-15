import { Box } from '@/components/UI/Layout';
import type { ReactNode } from 'react';

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box as="main" mt={3}>
      {children}
    </Box>
  );
};
