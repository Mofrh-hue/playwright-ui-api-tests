import { defineConfig, devices } from '@playwright/test';

/**
 * Three test projects:
 *  - ui:         end-to-end UI tests against the stable demo shop
 *  - api:        REST API tests against the shop's public API
 *  - known-bugs: regression checks that reproduce defects in the deliberately buggy build
 */
export default defineConfig({
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // The demo shop marks elements with data-test="...", not Playwright's default data-testid.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://practicesoftwaretesting.com' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://api.practicesoftwaretesting.com' },
    },
    {
      name: 'known-bugs',
      testDir: './tests/known-bugs',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://with-bugs.practicesoftwaretesting.com' },
    },
  ],
});
