import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchReset: Locator;
  readonly searchCaption: Locator;
  readonly noResults: Locator;
  readonly sortSelect: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.searchReset = page.getByTestId('search-reset');
    this.searchCaption = page.getByTestId('search-caption');
    this.noResults = page.getByTestId('no-results');
    this.sortSelect = page.getByTestId('sort');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
    this.productCards = page.locator('a.card');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.productNames.first()).toBeVisible();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    // Wait for the search API response, not just the caption, so the grid
    // is never read while it still shows the previous results.
    const response = this.page.waitForResponse(
      (r) => r.url().includes('/products/search') && r.request().method() !== 'OPTIONS',
    );
    await this.searchButton.click();
    await response;
    await expect(this.searchCaption).toContainText(term);
  }

  async sortBy(value: 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc') {
    await this.sortSelect.selectOption(value);
  }

  async names(): Promise<string[]> {
    return (await this.productNames.allInnerTexts()).map((n) => n.trim());
  }

  async prices(): Promise<number[]> {
    return (await this.productPrices.allInnerTexts()).map((p) => Number(p.replace(/[^0-9.]/g, '')));
  }

  async openProduct(name: string) {
    await this.productCards.filter({ hasText: name }).first().click();
  }
}
