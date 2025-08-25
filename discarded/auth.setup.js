import { test as setup } from '@playwright/test';
import path from 'path';
import { chromium } from '@playwright/test';

const authFile = path.join(__dirname, "../.auth/user.json");

setup("Authenticate and save user auth", async () => {
  // Abrimos un navegador visible para hacer login manual
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL);

  await page.waitForTimeout(30000);
  
  await page.waitForLoadState("domcontentloaded");

  await context.storageState({ path: authFile });

  await page.waitForTimeout(5000); 

  await browser.close();
});