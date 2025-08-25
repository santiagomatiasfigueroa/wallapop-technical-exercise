import { test as base, expect } from '@playwright/test';
import path from 'path';
var storagePath = path.join(__dirname, ".auth/user.json");

export const sellerTest = base.extend({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: storagePath,
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    await use(await context.newPage());
  },
});

export const anonTest = base.extend({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    await use(await context.newPage());
  },
});