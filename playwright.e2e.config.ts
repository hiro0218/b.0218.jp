import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const HOST = '127.0.0.1';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { outputFolder: 'playwright-report-e2e', open: 'never' }], ['list'], ['github']]
    : [['html', { outputFolder: 'playwright-report-e2e', open: 'never' }], ['list']],
  outputDir: 'test-results-e2e',
  use: {
    baseURL: `http://${HOST}:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: {
    command: `SKIP_OGP=true npm run prebuild && npm run build && npm run start -- -p ${PORT} -H ${HOST}`,
    url: `http://${HOST}:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 600_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
