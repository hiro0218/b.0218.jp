import react from '@vitejs/plugin-react';
import { join } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '~': join(__dirname, ''),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      extension: ['ts'],
    },
  },
});
