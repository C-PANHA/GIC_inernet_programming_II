import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();
}

test.describe('Cart', () => {
  test('add product to cart', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: /add to cart/i }).first().click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('view cart page', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
  });

  test('remove item from cart', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: /remove/i }).click();

    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('sort products low to high', async ({ page }) => {
    await login(page);

    await page.getByRole('combobox').selectOption('lohi');

    const firstPrice = page.locator('.inventory_item_price').first();
    await expect(firstPrice).toHaveText('$7.99');
  });
});