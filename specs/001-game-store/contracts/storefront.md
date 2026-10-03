# Storefront Contract

**Date**: 2026-10-03. Consumers: visitor, evaluator, and browser tests.
**Related**: [spec](../spec.md), [data model](../data-model.md).

## Static build and navigation

- Produce one client-only Vite build for public GitHub Pages; project base is
  `/DF_I-Fundamentos_HTML_CSS/` as currently configured. No integrated/academic modes.
- Serve catalog JSON and built assets under Vite's `BASE_URL`; do not depend on root-only paths
  or server rewrites for internal views.
- Keep the existing SPA navigation. No auth/payment callbacks, remote service links, or second
  hosted storefront are required.
- Do not add credentials or service configuration to the build. A public hosting URL is not a
  claim that catalog, access, or purchase behavior is connected to a real service.

## Catalog interaction

Load the local JSON through `catalogApi`. Preserve loading, success, error/retry, empty, search,
category and featured-product behavior. Search, genre/platform filters, sorting and pagination,
when exposed, operate only on the available local entries and reset pagination after criteria
change. Do not suggest that the catalog is live or globally exhaustive. Show only available,
complete fictional offers as addable; keep game information distinct from its offer. Missing
descriptive fields or cover images use explicit fallback content. Retain attribution when local
content requires it; make no metadata API request.

## Cart interaction

Accessible controls add, increment, decrement, remove, and clear lines. Unit count, line subtotals,
and total use integer CLP arithmetic. Adding an existing product changes the selected state while
still allowing quantity changes. Empty cart blocks checkout. Invalid stored data is handled without
crashing and valid legacy `qBrandsCart` lines remain usable. Cart actions pass through one context
and pure reducer, applied with functional `useState` updates. Cart access does not depend on catalog
reload success.

## Demonstration access

Offer a simple local control to activate and close the fixed fictional profile. Label it clearly as
a demonstration. No login, password, registration, email collection, recovery, real session, or
private account data. The profile resets when the app reloads and cannot gate access as if it were
real authorization.

## Simulated checkout

Show cart lines and the final CLP amount with a persistent visible notice that checkout is a demo.
Use native validation for local line/amount consistency. Do not request name, email, address, card,
or payment method. Let the evaluator select or reproduce approved, rejected, cancelled, and pending
fictional outcomes. The result has a fictional reference and summary and says no order/payment was
created. Disable repeat submission for the same result. A simulated approval may clear only the
submitted cart snapshot; other results retain it. Never display a real purchase confirmation.

## Accessibility and evidence

Keep Bootstrap and the existing visual language; this is not a replacement landing page. Controls
have accessible names, keyboard operation, visible focus, sensible focus restoration, announced
loading/error/result states, and reduced-motion support. At 360 and 1280 px no main flow overlaps
or requires horizontal scrolling. Capture catalog, cart add/remove, empty/loading, fictional access,
and the four clearly labelled checkout outcomes. Evidence demonstrates only local educational
behavior, never identity or real payment.
