# Playwright UI & API Test Automation

[![Playwright tests](https://github.com/Mofrh-hue/playwright-ui-api-tests/actions/workflows/tests.yml/badge.svg)](https://github.com/Mofrh-hue/playwright-ui-api-tests/actions/workflows/tests.yml)

End-to-end UI tests and REST API tests for **[Toolshop](https://practicesoftwaretesting.com)**, a public demo web shop built for practising software testing. Written in **TypeScript** with **Playwright**, structured with the **Page Object Model**, and run automatically by **GitHub Actions** on every push and every Monday.

> This is a portfolio project. The application under test is a public practice site, not a client system.

## What is covered

| Suite | Tests | What it checks |
|---|---|---|
| **UI** (`tests/ui`) | 11 | Search (matching, case-insensitive, no-results message, clearing the search), sorting by name and price in both directions, product page data, quantity controls, add-to-cart confirmation, cart line and total prices |
| **API** (`tests/api`) | 6 | `GET /products` pagination and data validity, `GET /products/{id}`, `GET /products/search`, 404 for unknown ids, `GET /categories`, 401 for invalid login |
| **Known bugs** (`tests/known-bugs`) | 4 | Reproduces four defects in the shop's deliberately buggy build — see below |

## Known-bug regression tests

The shop has a second build seeded with defects. I tested it manually first and wrote up the findings in **[qa-manual-testing-portfolio](https://github.com/Mofrh-hue/qa-manual-testing-portfolio)**. The four most important defects are automated here:

| ID | Defect |
|---|---|
| BUG-01 | Clearing the search with "X" leaves the product grid empty |
| BUG-02 | Quantity + / − buttons don't change the quantity |
| BUG-03 | Cart line total shows `$00.00` |
| BUG-04 | An error message appears even though the item was added |

Each test asserts the **correct** behaviour and is marked `test.fail()`. While the bug exists, the test is reported as *expected to fail*; if a bug is ever fixed, the test turns red so the marker can be removed. This is how I'd keep known defects visible in a real regression suite without blocking the pipeline.

## Project structure

```
pages/                 Page Objects (HomePage, ProductPage, CartPage)
tests/ui/              UI tests against the stable build
tests/api/             API tests using Playwright's request fixture
tests/known-bugs/      Regression checks for defects in the bug build
playwright.config.ts   Three projects: ui, api, known-bugs
.github/workflows/     CI: type-check, run all tests, upload HTML report
```

## Run it locally

```bash
npm install
npx playwright install chromium
npm test                    # everything
npm run test:ui             # UI only
npm run test:api            # API only
npm run test:known-bugs     # bug-build checks only
npm run report              # open the HTML report
```

## Design choices

- **Stable selectors** — the shop exposes `data-test` attributes, so `testIdAttribute` is set to `data-test` instead of relying on CSS classes or text.
- **No fixed sleeps** — sorting and search use `expect.poll` and auto-waiting assertions, so tests wait exactly as long as needed.
- **Independent tests** — every test starts from a fresh browser context, so they run in parallel safely.
- **Evidence on failure** — screenshots on failure, a trace on retry, and the HTML report uploaded as a CI artifact.

---

Author: **Ahmed Mofrh Fahmy** — QA Test Lead · [GitHub profile](https://github.com/Mofrh-hue)
