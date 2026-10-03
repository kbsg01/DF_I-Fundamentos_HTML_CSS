# Data Model: Q Brands demonstration storefront

**Date**: 2026-10-03. Design only; no data migration performed.
**Related**: [spec](spec.md), [storefront contract](contracts/storefront.md).

## Ownership and money

The browser loads the public demonstration catalog from `public/data/products.json` through
`catalogApi`. `CartContext` is the sole owner of cart state. CLP values are non-negative integer
pesos; calculate totals with integer arithmetic. Quantities are integers from 1 to 99 and may
also be capped by a local demonstration availability value. No server or external authority exists.

## Catalog entry and offer

The catalog keeps the existing stable `id`, `name`, `category`, `description`, `cover`,
`regularPrice`, and `salePrice` JSON keys so existing consumers can be migrated incrementally.
The local demonstration schema may add optional `genres[]`, `platforms[]`, `released|null`, and
`rating|null` fields for display. Every entry offered in the cart must also provide complete
fictional commercial fields: `edition`, `activationPlatform`, `activationRegion`, `currency=CLP`,
`regularPrice`, `salePrice`, `availableUnits`, and `status`. Missing optional descriptive metadata
remains null or an empty list; missing cover uses the existing visual fallback.

Each entry represents game information and, when present, a fictional Q Brands offer. Only a
complete, available offer can be added to the cart. `0 <= salePrice <= regularPrice`; no price or
availability value represents live stock or a promise of delivery. Existing zero-priced entries
remain informational/free demonstration entries and must not be presented as paid purchases.
The offer-to-game association uses stable local IDs, not title matching. Content from third parties
retains its required attribution; no metadata API is called.

## Demo profile

`DemoProfile`: a fixed display label and an active/inactive flag held in React state. It has no
email, password, provider ID, token, registration, recovery, or authenticated identity. Transitions
are `visitor -> demo-profile -> visitor`. It is not persisted across reloads and is never described
as a real account or session.

## Cart and line

The cart uses the current `qBrandsCart` localStorage key and existing product-shaped lines:
`{id, name, cover, salePrice, quantity}` plus any existing product fields needed by consumers.
`CartContext` remains the single owner and exposes the current `items`, `itemCount`, `total`,
`addProduct`, `changeQuantity`, `removeProduct`, and `clearCart` API. State transitions use the pure
cart reducer through functional `useState` updates to meet S8 without a second cart.

On load, malformed JSON or invalid lines must not crash the store. Preserve valid products and
quantities, discard invalid lines with a recoverable notice, and preserve compatibility with the
existing array format. Storage failure leaves the in-memory cart usable and must not claim it was
persisted. Cart totals are derived from lines, not stored separately.

## Simulated result

`DemoReceipt`: a transient summary containing a generated fictional identifier, a snapshot of
the submitted product lines, CLP amount, and one of `approved`, `rejected`, `cancelled`, or
`pending`. Keep it in React state only; do not create an order table, persist a transaction, call a
payment service, or collect a payment method. Repeating a submitted action must not create a second
receipt for the same submission. A simulated approved outcome may clear only the submitted cart
snapshot; rejected, cancelled, and pending outcomes retain the cart. Every result is labelled as a
demonstration and cannot imply a real charge or delivery.

## Invariants

- A catalog entry without a complete available offer cannot be added to the cart.
- Prices, totals, and quantities remain integer and internally consistent in CLP.
- No password, email, address, card detail, token, real account, order, or payment is stored.
- Demo profile and receipt state are ephemeral; only the cart uses localStorage.
- Product and offer data remain outside presentation components.
