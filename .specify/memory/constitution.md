<!--
Sync Impact Report
- Version change: unversioned template -> 1.0.0
- Modified principles: none; established initial project principles
- Added sections: Technology and Accessibility Constraints; Development Workflow
- Removed sections: none
- Follow-up TODOs: RATIFICATION_DATE requires the project's original adoption date.
-->
# Q Brands Constitution

## Core Principles

### I. Declarative React Ownership
All user-visible state and side effects MUST have a clear React owner. Components MUST be
functional, state transitions MUST be explicit, and shared cart state MUST use the established
context and reducer boundary. Imperative DOM mutation is prohibited except where required by a
well-scoped third-party integration. This keeps storefront behavior predictable and testable.

### II. Catalog Data Is Independent
Product data MUST remain independent from presentation code and load through the catalog service.
Catalog consumers MUST handle loading, retry, and error states rather than assuming data is
immediately available. Changes to product fields MUST preserve a stable data contract or update
every consuming component in the same change. This permits catalog growth without coupling data to
the interface.

### III. Accessible and Reduced-Motion First
Interactive controls MUST be keyboard-operable, expose an accessible name, and retain usable focus
states. Loading, failure, and empty states MUST be conveyed accessibly. Motion MUST honor
`prefers-reduced-motion`; animation is enhancement only and MUST NOT block content or an action.
This ensures the storefront remains usable for all customers.

### IV. Cart Integrity and Checkout Validation
Cart mutations MUST go through the shared cart store and preserve persistence compatibility with
existing `localStorage` data. Quantity and total calculations MUST use the shared currency and cart
utilities. Checkout MUST use native validation before confirmation, and a confirmation MUST reflect
the submitted order. This protects the purchase flow from inconsistent client state.

### V. Focused, Verified Changes
Each change MUST be limited to its stated behavior and reuse the existing React, Bootstrap, and
utility patterns before introducing a new abstraction or dependency. Modified behavior MUST be
validated with the narrowest relevant command; `npm run lint` and `npm run build` MUST pass before
publication. This keeps a small storefront maintainable and deployable.

## Technology and Accessibility Constraints

The application MUST remain a React and Vite single-page storefront. Bootstrap is the primary
layout and component styling foundation, and existing responsive conventions MUST be preserved.
Remote catalog content MUST be fetched from the independent JSON data source. The production
artifact is the output of `npm run build`; source files and development-only behavior MUST NOT be
treated as deployable output.

## Development Workflow

Work MUST start by identifying the owning component, hook, service, context, or utility. Behavior
changes MUST account for loading, transient failures, responsive layouts, and reduced-motion
preferences where applicable. Pull requests or equivalent reviews MUST describe user-visible
effects, verify lint and production build results, and include targeted validation for cart,
checkout, or catalog contract changes. New dependencies, state ownership changes, and public data
contract changes require explicit justification in the change description.

## Governance

This constitution governs implementation, review, and release decisions for Q Brands and takes
precedence over undocumented local practice. Amendments MUST update this document, include a Sync
Impact Report, and receive review with any affected work. Versions follow semantic versioning:
MAJOR for incompatible principle removals or redefinitions, MINOR for new or materially expanded
governance, and PATCH for clarifications that preserve meaning. Every review MUST confirm relevant
principles, validation requirements, and accessibility obligations have been met. Complexity or
exceptions require written justification in the associated change.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date is unknown. |
**Last Amended**: 2026-10-02
