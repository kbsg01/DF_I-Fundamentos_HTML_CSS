# Backend Contract

**Status**: Not applicable to this feature.
**Date**: 2026-10-03.
**Related**: [spec](../spec.md), [storefront contract](storefront.md), [data model](../data-model.md).

The approved feature is a client-only static demonstration. It exposes no backend endpoints,
webhooks, database schema, provider callbacks, authentication API, or payment contract. The
catalog is a bundled public JSON file; fictional profile and checkout state are handled locally.

Do not implement or configure Supabase, RAWG, Mercado Pago, another API, server, database, or
service credentials for this feature. Local UI/data contracts are described in `storefront.md`
and `data-model.md`. GitHub Pages is only the static host; it does not participate in store flows.
