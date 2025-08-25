import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {

  await page.goto(process.env.BASE_URL + "/login");

  const loginButton = page.getByRole("button", { name: /Iniciar sesión/});

  await page.waitForLoadState("domcontentloaded");

  await loginButton.click();

  await page.waitForURL(/realms\/wallapop-internal/);

  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector("#username:not([disabled])");
  await page.locator("#username").fill(process.env.SELLER_USERNAME);
  await page.waitForSelector("#password:not([disabled])");
  await page.locator("#password").fill(process.env.SELLER_PASSWORD);
  await page.waitForSelector("#kc-login:not([disabled])");
  await page.locator('#kc-login').click();

  await page.waitForURL(/\/api\/auth\/callback\/keycloak/, { timeout: 20000 });

  await page.waitForURL("https://es.wallapop.com/wall", { timeout: 20000 });
  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: authFile });
});