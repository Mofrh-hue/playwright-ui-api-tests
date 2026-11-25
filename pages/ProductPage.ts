import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly quantity: Locator;
  readonly increase: Locator;
  readonly decrease: Locator;
  readonly addToCart: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    // The product page heading; list cards use the same test id, so target the <h1> only.
    this.name = page.locator('h1[data-test="product-name"]');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantity = page.getByTestId('quantity');
    this.increase = page.getByTestId('increase-quantity');
    this.decrease = page.getByTestId('decrease-quantity');
    this.addToCart = page.getByTestId('add-to-cart');
    this.cartBadge = page.getByTestId('cart-quantity');
  }

  async expectLoaded(productName: string) {
    await expect(this.name).toHaveText(productName);
    await expect(this.addToCart).toBeEnabled();
  }

  async price(): Promise<number> {
    return Number((await this.unitPrice.innerText()).replace(/[^0-9.]/g, ''));
  }
}
