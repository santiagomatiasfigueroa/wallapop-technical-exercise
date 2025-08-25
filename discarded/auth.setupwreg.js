import { test as setup } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, "../.auth/user.json");

setup("Register a new user and save auth", async ({ page }) => {

  setup.slow();

  await page.goto(process.env.BASE_URL + "/login");

  // Extra code to accept Privacy Settings   
  await page.waitForLoadState("domcontentloaded");
  const privacyBanner = page.locator("#onetrust-banner-sdk");
  const acceptPrivacyButton = privacyBanner.locator("#onetrust-accept-btn-handler");
  await acceptPrivacyButton.click();

  await page.getByRole("button", { name: /Continuar con el e-mail/ }).click();

  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector("#signup-name:not([disabled])");
  await page.locator("#signup-name").fill("Seller QA");
  await page.waitForSelector("#signup-email:not([disabled])");
  await page.locator("#signup-email").fill(process.env.SELLER_REGISTER_USERNAME);
  await page.waitForSelector("#signup-password:not([disabled])");
  await page.locator("#signup-password").fill(process.env.SELLER_PASSWORD);
  await page.locator("#terms_check").click();
  await page.getByRole("button", { name: /Crear una cuenta/ }).click();

  await page.waitForTimeout(6000);

  await expect(page.locator("[class^='otp-input_CodeWrapper']")).toBeVisible();

  await page.pause();

  await page.context().storageState({ path: authFile });

  await page.waitForTimeout(5000);

});
