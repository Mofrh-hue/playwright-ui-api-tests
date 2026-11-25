import { test, expect } from '@playwright/test';

type Product = { id: string; name: string; price: number };
type Page<T> = { current_page: number; per_page: number; total: number; data: T[] };

test.describe('Products API', () => {
  test('GET /products returns a paginated list of valid products', async ({ request }) => {
    const res = await request.get('/products?page=1');
    expect(res.status()).toBe(200);

    const body: Page<Product> = await res.json();
    expect(body.current_page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(body.per_page);
    expect(body.total).toBeGreaterThanOrEqual(body.data.length);

    for (const p of body.data) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(typeof p.price).toBe('number');
      expect(p.price).toBeGreaterThan(0);
    }
  });

  test('GET /products/{id} returns the same product as the list', async ({ request }) => {
    const list: Page<Product> = await (await request.get('/products?page=1')).json();
    const first = list.data[0];

    const res = await request.get(`/products/${first.id}`);
    expect(res.status()).toBe(200);
    const product: Product = await res.json();
    expect(product.id).toBe(first.id);
    expect(product.name).toBe(first.name);
    expect(product.price).toBe(first.price);
  });

  test('GET /products/search returns only matching products', async ({ request }) => {
    const res = await request.get('/products/search?q=pliers');
    expect(res.status()).toBe(200);

    const body: Page<Product> = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    for (const p of body.data) {
      expect(p.name.toLowerCase()).toContain('pliers');
    }
  });

  test('GET /products/{id} with an unknown id returns 404', async ({ request }) => {
    const res = await request.get('/products/DOES-NOT-EXIST');
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ message: 'Requested item not found' });
  });
});

test.describe('Categories API', () => {
  test('GET /categories includes the main tool categories', async ({ request }) => {
    const res = await request.get('/categories');
    expect(res.status()).toBe(200);

    const names = (await res.json()).map((c: { name: string }) => c.name);
    expect(names).toEqual(expect.arrayContaining(['Hand Tools', 'Power Tools']));
  });
});

test.describe('Login API', () => {
  test('POST /users/login rejects unknown credentials with 401', async ({ request }) => {
    const res = await request.post('/users/login', {
      data: { email: 'no-such-user@example.com', password: 'not-a-real-password' },
    });
    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });
});
