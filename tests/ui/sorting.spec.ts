import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

const byName = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' });

test.describe('Product sorting', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
  });

  test('sorts by name A to Z', async () => {
    await home.sortBy('name,asc');
    await expect.poll(async () => {
      const names = await home.names();
      return names.length > 1 && names.join('|') === [...names].sort(byName).join('|');
    }).toBe(true);
  });

  test('sorts by name Z to A', async () => {
    await home.sortBy('name,desc');
    await expect.poll(async () => {
      const names = await home.names();
      return names.length > 1 && names.join('|') === [...names].sort(byName).reverse().join('|');
    }).toBe(true);
  });

  test('sorts by price low to high', async () => {
    await home.sortBy('price,asc');
    await expect.poll(async () => {
      const prices = await home.prices();
      return prices.length > 1 && prices.every((p, i) => i === 0 || prices[i - 1] <= p);
    }).toBe(true);
  });

  test('sorts by price high to low', async () => {
    await home.sortBy('price,desc');
    await expect.poll(async () => {
      const prices = await home.prices();
      return prices.length > 1 && prices.every((p, i) => i === 0 || prices[i - 1] >= p);
    }).toBe(true);
  });
});
