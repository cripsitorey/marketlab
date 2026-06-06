# 009 - MarketLab UI/UX Redesign

Significantly improve the MarketLab UI. This is not a small polish pass: the app was built incrementally, so make it cohesive, modern, and demo-ready for a Cursor + Supabase workshop.

## Product

MarketLab is a fake-money binary Yes/No market app. Users can browse markets, sign in, see fake balance, buy Yes/No shares, and view positions.

Keep the core scope unchanged. Do not add features, dependencies, or backend changes unless required for UI integration. The app must not feel like real betting, gambling, or financial trading.

Follow `AGENTS.md`.

## Before Coding

- Audit the current UI/code: header, markets list, market detail, buy form, positions, auth, empty/error/loading states, light/dark theme, and mobile.
- Optional: do brief inspiration research on SaaS/fintech-lite dashboards, card lists, forms, and empty states. Use inspiration only; do not copy.
- Write a short design direction covering style, layout, color, components, UX, and what to avoid, then implement it.

## Design Direction

- Polished fake-money market dashboard, not a landing page or CRUD template.
- Strong hierarchy and clear fake-money framing on every surface.
- Use the teal/emerald brand accent from the existing logo in `public/logo/`.
- Yes = emerald. No = rose. Use brand color sparingly.
- Make light and dark themes intentional: layered surfaces, readable contrast, good cards, borders, inputs, badges, and buttons.
- Reuse the existing theme system and persistence.
- Use Tailwind v4 and existing shadcn-style patterns.
- Add small shared components only when they reduce real duplication.

Avoid:

- hero or stock images
- decorative gradients
- marketing sections
- testimonials or pricing
- real-money, trading, gambling, or advice copy
- new chart types
- unnecessary abstractions
- new dependencies

## Pages To Improve

App shell:

- logo + wordmark
- nav: Markets, My Positions
- active state
- auth controls
- fake balance when signed in
- theme toggle
- mobile-friendly layout

Markets list:

- concise product intro and fake-money chips
- polished cards with status, close date, and CTA
- empty state
- responsive grid
- no hero image

Market detail:

- title, description, status, close date
- Yes/No framing
- fake-money note
- existing simple Yes-chance chart and outcomes
- buy section
- back nav
- closed and signed-out states

Buy form:

- Yes/No selector
- fake dollars input
- balance
- live preview: amount to share cents
- validation, pending, success, error, disabled, closed, and signed-out states
- accessible labels and focus states

Positions:

- summary row: markets held, total shares, Yes/No exposure
- polished cards or table
- empty and signed-out states
- links to markets

Auth:

- polished login/signup cards
- fake-money copy
- inputs and focus states
- optional styled `not-found.tsx`

## Copy To Use

- "Browse fictional Yes/No markets using fake money."
- "Spend fake cents to collect Yes or No shares."
- "1 fake cent spent = 1 share cent."
- "This workshop app does not use real money."

## Do Not Implement

- real payments
- betting behavior
- trading advice
- political markets
- selling
- order books
- AMMs
- market creation
- admin
- comments
- notifications
- analytics
- settlement unless already in the app

Do not break Supabase auth, fake balance, buy flow, positions, RLS, Taskfile commands, or light/dark theme.

## Tests & Verification

- Update focused Vitest tests for changed behavior.
- Preserve test-critical strings, roles, and hrefs.
- Run `task verify` when practical.
- Manually check light/dark, mobile, signed-in/out, buy success/error, empty states, and closed market states.

## Deliver When Done

- design direction chosen
- research influence, if any
- biggest problems found
- main visual and UX changes
- files changed
- what you did not change
- checks run
- remaining risks
- manual review steps
