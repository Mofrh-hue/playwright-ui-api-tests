import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productQuantity: Locator;
  readonly linePrice: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.getByTestId('product-title');
    this.productQuantity = page.getByTestId('product-quantity');
    this.linePrice = page.getByTestId('line-price');
    this.cartTotal = page.getByTestId('cart-total');
  }

  async open() {
    await this.page.getByTestId('nav-cart').click();
  }
}

/** Parses "$28.30" into 28.3 */
export const money = (text: string) => Number(text.replace(/[^0-9.]/g, ''));
