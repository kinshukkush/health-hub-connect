import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration for HealthHub Connect
 *
 * This configuration supports:
 * - Multiple browsers (Chromium, Firefox, WebKit)
 * - Parallel execution
 * - Cross-browser testing (desktop, tablet, mobile viewports)
 * - Video recording on failure
 * - Screenshot on failure
 * - Trace on first retry
 * - HTML, JSON, and List reporting
 */
export default defineConfig({
  testDir: './tests',

  /* Maximum time one test can run for */
  timeout: 30 * 1000,

  /* Test timeout for each assertion */
  expect: {
    timeout: 10 * 1000
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : 4,

  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://health-hub-connect-livid.vercel.app',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Maximum time each action can take */
    actionTimeout: 10 * 1000,

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers with viewport variations */
  projects: [
    /* Desktop viewports (1280x720) */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--disable-web-security']
        }
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    /* Tablet viewport (768x1024) */
    {
      name: 'tablet-chromium',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 768, height: 1024 }
      },
    },

    /* Mobile viewports (375x667) */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 }
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 375, height: 667 }
      },
    },

    /* Test against branded browsers */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
