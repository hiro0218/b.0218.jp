import react from '@vitejs/plugin-react';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    include: ['**/*.test.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
    },
  },
});
