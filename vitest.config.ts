import { join } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': join(__dirname, 'src') },
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
