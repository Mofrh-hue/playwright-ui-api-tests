import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage, money } from '../../pages/CartPage';

/**
 * These tests run against the deliberately buggy build of the shop.
 * Each one checks the CORRECT behaviour and is marked test.fail() because the
 * bug is known to be present. They report as "expected to fail" while the bug
 * exists — and turn red the day a bug is fixed, so the marker can be removed.
 *
 * Bug IDs match the manual bug report in the qa-manual-testing-portfolio repo.
 */
const PRODUCT = 'Combination Pliers';

test.describe('Known defects in the bug build', () => {
  test('BUG-01: clearing the search restores the product list', async ({ page }) => {
    test.fail(true, 'BUG-01: clicking X after a search leaves the product grid empty');
    const home = new HomePage(page);
    await home.open();
    const before = await home.productNames.count();
    await home.search('pliers');
    await expect.poll(() => home.productNames.count()).toBeLessThan(before);

    await home.searchReset.click();

    await expect(home.productNames).toHaveCount(before, { timeout: 8_000 });
  });

  test('BUG-02: the + button increases the quantity', async ({ page }) => {
    test.fail(true, 'BUG-02: quantity + and - buttons do not change the value');
    const home = new HomePage(page);
    await home.open();
    await home.productNames.filter({ hasText: PRODUCT }).first().click();
    const product = new ProductPage(page);
    await product.expectLoaded(PRODUCT);

    await product.increase.click();

    await expect(product.quantity).toHaveValue('2', { timeout: 5_000 });
  });

  test('BUG-03: the cart line total equals quantity x unit price', async ({ page }) => {
    test.fail(true, 'BUG-03: cart line total shows $00.00');
    const home = new HomePage(page);
    await home.open();
    await home.productNames.filter({ hasText: PRODUCT }).first().click();
    const product = new ProductPage(page);
    await product.expectLoaded(PRODUCT);
    const unit = await product.price();

    await product.quantity.fill('2');
    await product.addToCart.click();
    await expect(product.cartBadge).toHaveText('2');
    const cart = new CartPage(page);
    await cart.open();
    await expect(cart.cartTotal).toBeVisible();

    expect(money(await cart.linePrice.innerText())).toBe(Math.round(unit * 2 * 100) / 100);
  });

  test('BUG-04: adding to the cart shows a success message', async ({ page }) => {
    test.fail(true, 'BUG-04: an error toast appears even though the item is added');
    const home = new HomePage(page);
    await home.open();
    await home.productNames.filter({ hasText: PRODUCT }).first().click();
    const product = new ProductPage(page);
    await product.expectLoaded(PRODUCT);

    await product.addToCart.click();

    await expect(page.getByText('Product added to shopping cart.')).toBeVisible({ timeout: 5_000 });
  });
});
