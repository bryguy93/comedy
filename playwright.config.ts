import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  testMatch: [
    "tests/comedy/comedyMob24.spec.ts",
    "tests/comedy/cCellar.spec.ts",
    "tests/comedy/theStand.spec.ts",
    "tests/comedy/NYCC.spec.ts",
    "tests/comedy/kerasotes.spec.ts",
    "tests/comedy/LA/theStore.spec.ts",
    "tests/comedy/socialMedia/IgAutoFollowHourly.spec.ts"
    // "lighthouse/unauth.test.ts",
    // "lighthouse/auth.test.ts"
    // "tests/registerUser.test.ts",
    // "tests/loginUser.test.ts",
    // "tests/addProductToCart.test.ts",
    // "tests/flipkart.test.ts"
  ],
  timeout: 1 * 90 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: !true,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 3 : 1,
  reporter: process.env.CI ? 'html' : 'line',
  //reporter: process.env.CI ? [["junit", {
  //  outputFile: "results.xml"
  //}]] : [["json", {
  //  outputFile: "report.json"
  //}], ["html", {
  //  open: "on-failure"
  //}]],
  use: {
    headless: process.env.CI ? true : true,
    baseURL: "https://bookcart.azurewebsites.net/",
    // actionTimeout: 2 * 60 * 1000,
    trace: process.env.CI ? "retain-on-failure" : "retain-on-failure",
    video: process.env.CI ? "off" : "on",
    screenshot: process.env.CI ? "off" : "on",
    
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // }
  ]
};

export default config;