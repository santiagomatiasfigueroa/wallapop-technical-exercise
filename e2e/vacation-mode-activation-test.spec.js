import { test, expect } from '@playwright/test';

test('Has title (health check)', async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await expect(page).toHaveTitle(/Wallapop/);
});

test("Browse to seller item and validate it is not blocked", async ({ page }) => {
  await page.goto(process.env.BASE_URL + process.env.SELLER_USER_PROFILE);
  await page.waitForLoadState("domcontentloaded");
  const firstArticle = page.locator('a[href^="/item/"]').first()
  const firstArticleHref = await firstArticle.getAttribute('href');
  await page.goto(firstArticleHref);
  await page.waitForURL(firstArticleHref);
  await page.waitForLoadState("domcontentloaded");
  const bigBuyButton = page.locator("[class^='item-detail-actions_ItemDetailButtons']").getByRole("button", { name: /Comprar/});
  await expect(bigBuyButton).toBeVisible();
  const bigChatButton = page.locator("[class^='item-detail-actions_ItemDetailButtons']").getByRole("button", { name: /Chat/});
  await expect(bigChatButton).toHaveCount(0);
});

test('Enable seller Vacation Mode through direct link', async ({ page}) => {
  await page.goto(process.env.BASE_URL, { waitUntil: 'domcontentloaded' });

  // We pause the browser for manual login input, then we need to resume manually the test
  await page.pause();

  await page.goto(process.env.BASE_URL + process.env.VACATION_MODE_SHORTCUT, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState("domcontentloaded");
  const vacationModeContainer = page.locator(".VacationMode__vacationInformationContainer");
  await expect(vacationModeContainer).toBeVisible();
  const VacationModeToggle = vacationModeContainer.locator("input[type='checkbox']");
  await expect(VacationModeToggle).not.toBeChecked();
  await VacationModeToggle.locator('..').click();
  await page.waitForLoadState("domcontentloaded");
  await page.getByLabel('Seleccionar año').selectOption("2028");
  await page.locator(".VacationModeDatepicker__customDay").first().click();
  await page.getByRole("button", { name: /Confirmar/}).click();
  await page.waitForLoadState("domcontentloaded");
  await expect(VacationModeToggle).toBeChecked();
  const vacationModeDateDetails = page.locator(".VacationMode__dateDetailsWrapper");
  await expect(vacationModeDateDetails).toBeVisible();

});

test('Browse to seller item and validate it is blocked', async ({ page }) => {
  await page.goto(process.env.BASE_URL + process.env.SELLER_USER_PROFILE);
  await page.waitForLoadState("domcontentloaded");
  const firstArticle = page.locator('a[href^="/item/"]').first()
  const firstArticleHref = await firstArticle.getAttribute('href');
  await page.goto(firstArticleHref);
  await page.waitForURL(firstArticleHref);
  await page.waitForLoadState("domcontentloaded");
  const bigChatButton = page.locator("[class^='item-detail-actions_ItemDetailButtons']").getByRole("button", { name: /Chat/});
  await expect(bigChatButton).toBeVisible();
  const bigBuyButton = page.locator("[class^='item-detail-actions_ItemDetailButtons']").getByRole("button", { name: /Comprar/});
  await expect(bigBuyButton).toHaveCount(0);
});
