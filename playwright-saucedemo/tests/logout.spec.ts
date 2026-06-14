import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();
}

test('logout returns to login page', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('link', { name: /logout/i }).click();

  await expect(page.getByPlaceholder('Username')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});