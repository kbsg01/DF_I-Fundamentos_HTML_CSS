# Quickstart Validation Guide

**Date**: 2026-10-03. Run after implementation; this guide does not certify current behavior.
**Related**: [plan](plan.md), [data model](data-model.md),
[storefront](contracts/storefront.md), [backend scope](contracts/backend.md).

## Prerequisites

- Node 22.12+ compatible with Vite and npm.
- Chromium installed for Playwright browser tests.
- Python 3 is optional for mounting the Pages project subpath in a local static server.
- No API key, provider account, Docker, Deno, database, email service, or secret is required.

The previous validation record is in [s8-validation.md](../../docs/s8-validation.md). The project
already defines `npm test`, `npm run test:e2e`, `npm run lint`, `npm run build`, and `npm run preview`.
Add focused test files during implementation; do not claim a test suite passed when none exists.

## Local validation

From the repository root in PowerShell:

```powershell
npm ci
npm test
npm run test:e2e
npm run lint
npm run build -- --base=/DF_I-Fundamentos_HTML_CSS/
```

`vite preview` serves `dist` at `/`; it does not mount a repository subpath. To smoke-test the Pages
artifact locally on Windows, stage the built files under the project prefix and serve that directory:

```powershell
$previewRoot = Join-Path $PWD 'test-results/pages-preview'
$projectRoot = Join-Path $previewRoot 'DF_I-Fundamentos_HTML_CSS'
New-Item -ItemType Directory -Force $projectRoot | Out-Null
Copy-Item -Path 'dist/*' -Destination $projectRoot -Recurse -Force
python -m http.server 4173 --bind 127.0.0.1 --directory $previewRoot
```

Open `http://127.0.0.1:4173/DF_I-Fundamentos_HTML_CSS/`. Verify `index.html`, JavaScript/CSS,
`data/products.json`, and cover fallbacks load from the configured base. Confirm the browser
console has no errors and the catalog makes no business API requests. Existing cover URLs may
request their image host; failure must use the local visual fallback. An alternative local static
server may be used if it maps the repository prefix to the contents of `dist`.

For local development at root, use `npm run dev` and the default `/` base. Use the explicit
project base for production build; do not infer academic/integrated modes or configure provider
environment variables.

## Deterministic test scenarios

1. Catalog: load the local JSON; search/filter/sort; empty results; malformed or unavailable JSON;
   retry; missing descriptive data and image fallback.
2. Cart: add, increment, decrement, remove, clear, empty state, CLP totals, invalid quantities,
   malformed localStorage and valid legacy `qBrandsCart` data; reload retains the cart.
3. Demo access: activate and close the fictional profile; verify its label, no credentials or
   personal-data fields, and reset on reload.
4. Checkout: valid summary, empty cart, invalid line/amount, each of four fictional outcomes,
   visible notice, no payment/contact fields, no duplicate receipt, and correct cart handling.
5. Browser/accessibility: 360/1280 px, keyboard-only, focus, reduced motion, loading/error/empty,
   access and result states; verify no horizontal overflow, overlapping content, or console errors.

Unit tests should stub `fetch` for the local JSON request and use deterministic data. Browser tests
should assert no calls to catalog/auth/payment provider endpoints; they may intercept cover-image
requests when deterministic screenshots are needed.

## Static publication and S8 evidence

The approved destination is public GitHub Pages. Build `dist` with the project base path; the
manual workflow publishes its contents to the `gh-pages` branch using
`peaceiris/actions-gh-pages`. Configure Pages as **Deploy from a branch**, branch `gh-pages`,
folder `/`, and allow the workflow to write repository contents. Do not publish without explicit
authorization. Do not configure a second hosted storefront or a backend.

After an authorized deployment, verify the public URL, repository link, subpath, JSON, assets,
reload behavior, and the same catalog/cart/access/checkout flows. Evidence must show dynamic local
JSON loading, cart changes, conditional states, `useState`, `useEffect`, and accessibility at the
required widths. All access and purchase outputs must remain visibly fictional.

## Completion criteria

- SC-001: at least 9 of 10 discovery runs find a known game and open its details within 60 seconds.
- SC-002/003/005/007: every required cart, demo-access, checkout, and catalog-failure case passes.
- SC-004: prepared cart, demo access, review, and simulated outcome complete within 3 minutes.
- SC-006: browser checks at both widths and with keyboard/reduced motion pass.
- SC-008: public demo/repository links and all five S8 criteria are verifiable.
- Report exact test/build commands, results, and any gaps; never report simulated access/payment as real.
