# Research: Q Brands static educational storefront

**Date**: 2026-10-03. Research uses current repository evidence and official Vite/GitHub Pages documentation; no services are configured.

## 1. Runtime and data boundary

**Decision**: Keep one React/Vite SPA. Load the demo catalog from `public/data/products.json` through the existing `catalogApi`; keep filtering and checkout simulation in the browser. Do not call RAWG, Supabase, Mercado Pago, or another provider.
**Rationale**: This matches the clarified educational scope and the existing independent JSON catalog. It avoids credentials, provider availability, server authority, and any claim that a simulated profile or result is real.
**Alternatives considered**: a service-backed integrated build (out of scope), embedding all product records in presentation components (breaks catalog independence), or adding a local API server (unnecessary for static JSON).

The current catalog service already fetches `${import.meta.env.BASE_URL}data/products.json`, retries transient failures, and supports cancellation. Retain this boundary and its loading/error/retry states. Existing product records contain identity, category, name, description, CLP prices, and cover URL; extend the local fixture only with fields required by the specification. Product values and all access/payment states must be labelled as demonstrations, not live stock or transactions.

The existing cover URLs point to a third-party image CDN. They are static image references, not a catalog or payment integration; image failures must keep the existing fallback. Do not add API calls or credentials for image metadata. No email, address, password, card, or other personal/payment data is needed for a fictional profile or receipt.

Sources: [catalogApi](../../src/services/catalogApi.js), [useCatalog](../../src/hooks/useCatalog.js), [products.json](../../public/data/products.json), [Vite public assets](https://vite.dev/guide/assets.html).

## 2. Static publication

**Decision**: Publish one static Vite build to the already-approved public GitHub Pages project site. Use the repository subpath `/DF_I-Fundamentos_HTML_CSS/` as the production base path and validate the generated `dist` artifact with Vite preview before any authorized publication.
**Rationale**: GitHub Pages serves static HTML, CSS, and JavaScript, which fits a client-only educational demo. Vite requires the correct `base` for a project site; the existing configuration already records the current subpath. `import.meta.env.BASE_URL` keeps the catalog JSON request under that base.
**Alternatives considered**: a provider-backed build (out of scope), a backend host (no backend is in scope), or deploying with root-relative asset paths (breaks project-site assets).

Vite documents building to `dist`, previewing that output locally, and setting `base` to `/<repo>/` for a project site. GitHub Pages documents serving built static files and deploying a Vite project through GitHub Actions. Planning does not authorize changing Pages settings or dispatching a deployment. GitHub Pages records visitor IP addresses for security; the demo must not collect additional personal information.

Sources: [Vite static deployment](https://vite.dev/guide/static-deploy.html), [Vite base option](https://vite.dev/config/shared-options.html#base), [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Vite config](../../vite.config.js).

## 3. State, checkout, and S8

**Decision**: Preserve the existing `CartContext`, pure cart reducer, `qBrandsCart` localStorage key, and CLP utility. For S8, update the single cart owner to use functional `useState` transitions through the pure reducer; do not introduce a second cart. Keep the fictional access profile in ephemeral React state and the simulated receipt/results local to the checkout flow.
**Rationale**: The constitution requires one context/reducer boundary and compatible cart persistence; the S8 rubric explicitly evaluates `useState`, `useEffect`, and conditional rendering. The demo profile and receipt contain no real identity or transaction and need not be persisted.
**Alternatives considered**: a second cart state (can diverge), real login/checkout providers (out of scope), or persisting profile/receipt as if they were accounts/orders (misleading).

The current `Checkout` accepts name, email, address, and payment method, then clears the cart and displays "Pedido confirmado". The implementation plan must replace those fields with an explicit educational simulation, show the selected fictional outcome as fictitious, avoid collecting personal/payment data, and never describe a real order or charge. Repeated confirmation must not create duplicate demo receipts. An approved demo outcome may clear only the cart snapshot submitted; non-approved outcomes retain the cart, consistent with the spec's cart-preservation criterion.

Sources: [constitution](../../.specify/memory/constitution.md), [CartContext](../../src/context/CartContext.jsx), [Checkout](../../src/components/Checkout.jsx), [S8 instructions](../../docs/s8%20docs/PFY2201_Exp3_S8_Instrucciones_especificas%20%28forma%20A%29.md), [S8 rubric](../../docs/s8%20docs/PFY2201_Exp3_S8_Pauta_de_evaluacion_sumativa.md).

## 4. Validation strategy

**Decision**: Use the installed Vitest/Testing Library setup for catalog, cart, and checkout behavior; Playwright Chromium for desktop/mobile user journeys; and the existing lint/build/preview scripts. No service integration suite is required.
**Rationale**: The scope has no backend, database, identity provider, or payment provider to integrate. Unit and browser tests can prove the specified local behavior directly.
**Alternatives considered**: Deno, Docker, Supabase local, or provider sandbox tests (validate out-of-scope integrations); HTTP contract tests for endpoints that do not exist.

Current `package.json` defines `npm test`, `npm run test:e2e`, `npm run lint`, `npm run build`, and `npm run preview`. `npm run test:integration` points to `scripts/test-integration.mjs`, which is absent, and there are currently no unit or E2E test files. Plan implementation tasks should add focused tests and remove the dead integration-test script and Supabase SDK/configuration artifacts after verifying that no source code depends on them.

Sources: [package.json](../../package.json), [Vitest config](../../vitest.config.js), [Playwright config](../../playwright.config.js), [Playwright](https://playwright.dev/docs/intro), [Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Research completion

No technical unknowns remain for the approved demo scope. The existing implementation state, including unused Supabase configuration/dependency files from prior work, is not evidence that a real integration belongs in this feature. No account, secret, provider setup, or deployment is performed during planning. Constitution gates pass at the design level; runtime and publication evidence remain implementation work.
