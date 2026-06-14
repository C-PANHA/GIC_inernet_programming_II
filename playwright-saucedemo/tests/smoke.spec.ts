import { test, expect } from '@playwright/test';

test('Sauce Demo homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);
  await expect(page.getByText('Epic sadface:')).toHaveCount(0);
});