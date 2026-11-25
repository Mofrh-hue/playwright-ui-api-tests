import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage, money } from '../../pages/CartPage';

const PRODUCT = 'Combination Pliers';

test.describe('Product page and cart', () => {
  test('product page shows the same name and price as the product list', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const card = home.productCards.filter({ hasText: PRODUCT }).first();
    const listPrice = money(await card.getByTestId('product-price').innerText());

    await home.openProduct(PRODUCT);

    const product = new ProductPage(page);
    await product.expectLoaded(PRODUCT);
    expect(await product.price()).toBe(listPrice);
  });

  test('quantity buttons increase and decrease the quantity', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.openProduct(PRODUCT);
    const product = new ProductPage(page);
    await product.expectLoaded(PRODUCT);

    await expect(product.quantity).toHaveValue('1');
    await product.increase.click();
    await expect(product.quantity).toHaveValue('2');
    await product.decrease.click();
    await expect(product.quantity).toHaveValue('1');
  });

  test('adding 2 items shows a confirmation and the correct totals in the cart', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.openProduct(PRODUCT);
    const product = new ProductPage(page);
    await product.expectLoaded(PRODUCT);
    const unit = await product.price();

    await product.increase.click();
    await product.addToCart.click();

    await expect(page.getByText('Product added to shopping cart.')).toBeVisible();
    await expect(product.cartBadge).toHaveText('2');

    const cart = new CartPage(page);
    await cart.open();
    await expect(cart.productTitle).toContainText(PRODUCT);
    await expect(cart.productQuantity).toHaveValue('2');

    const expected = Math.round(unit * 2 * 100) / 100;
    expect(money(await cart.linePrice.innerText())).toBe(expected);
    expect(money(await cart.cartTotal.innerText())).toBe(expected);
  });
});
