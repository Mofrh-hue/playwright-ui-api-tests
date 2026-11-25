import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Product search', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
  });

  test('returns only matching products', async () => {
    await home.search('pliers');

    // Poll until the grid has re-rendered with the search results.
    await expect
      .poll(async () => {
        const names = await home.names();
        return names.length > 0 && names.every((n) => n.toLowerCase().includes('pliers'));
      })
      .toBe(true);
  });

  test('is case-insensitive', async () => {
    await home.search('pliers');
    const lower = await home.names();

    await home.search('PLIERS');
    await expect.poll(() => home.names()).toEqual(lower);
  });

  test('shows a clear message when nothing matches', async () => {
    await home.search('xyzzy-no-such-tool');

    await expect(home.noResults).toHaveText('There are no products found.');
    await expect(home.productNames).toHaveCount(0);
  });

  test('clearing the search restores the full product list', async () => {
    const before = await home.productNames.count();
    await home.search('pliers');
    await expect.poll(() => home.productNames.count()).toBeLessThan(before);

    await home.searchReset.click();

    await expect(home.productNames).toHaveCount(before);
  });
});
