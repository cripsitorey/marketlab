# 006 - Build MarketLab Market Browsing And Detail UI

Build the MarketLab market browsing and detail UI.

Create a clean, modern market list and detail experience that feels like a simple fake-money market dashboard.

The pages should quickly communicate: "Browse fictional Yes/No markets using fake money."

## Design Requirements

- Use a clean dashboard-style layout.
- Do not use a large hero image, stock image, or decorative picture.
- If the starter/template image is still being shown, remove it from the UI.
- If that image file is unused after removal, delete it.
- The market list should remain the main entry point.
- Use clear spacing, readable typography, simple cards, and good visual hierarchy.
- Make the layout responsive.
- Support both light and dark theme.
- If the project already has theme support, reuse it.
- If theme support is missing, add the smallest reasonable light/dark theme implementation.
- Add a simple theme toggle in the header.
- Persist the selected theme when practical.
- Respect system theme by default when practical.
- Avoid adding dependencies unless clearly necessary.

## Header Requirements

- Add or update a simple app header.
- Include:
  - app name: MarketLab
  - navigation to the markets page
  - theme toggle
- Keep the header ready for auth state later, but do not implement auth in this step unless it already exists.
- Do not add unnecessary navigation items.

## Market List Requirements

- Create or update the market list page.
- Fetch markets from Supabase.
- Display markets in clean cards.
- Each card should show:
  - title
  - description
  - status
  - close date
  - link or button to view details
- Add a good empty state.
- Make the page work for signed-in and signed-out visitors.
- Reuse existing components where possible.
- Keep styling consistent with the project.

## Market Detail Requirements

- Create or update the `/markets/[id]` page.
- Read the current implementation first and build on existing routing, fetch helpers, `notFound()`, back link, info card, outcomes, buy placeholder, `isMarketBuyable()`, seed data, and tests when present.
- Fetch the selected market from Supabase.
- Display the market title, description, status, close date, and outcomes/details.
- Include a clear back link to the market list.
- Make the page work for signed-in and signed-out visitors.
- Reuse existing components where possible.
- Keep styling consistent with the market list page.

## Probability Chart Requirements

Add a read-only probability chart section to the market detail page. The graph must render; do not replace it with an unavailable state.

- Use only the existing prompt 005 schema: `markets`, `positions`, and `ledger_entries`.
- Do not add a price-history table, extra table, seed data, script, or hard-coded market-price records.
- Do not create mock/generated market-price data or a deterministic fake series.
- Compute the current **Yes** chance from aggregate `positions` for this market:
  `yes_total = sum(yes_shares_cents)`, `no_total = sum(no_shares_cents)`, `yes_chance = yes_total / (yes_total + no_total)`.
- If aggregate positions are unavailable under the existing RLS/helpers, or if there are no positions yet, use a documented neutral baseline of `50%` because no Yes/No activity is available.
- For the line chart, use real `ledger_entries` for this market when they include enough existing side information in `entry_type`, `description`, or metadata to reconstruct Yes/No activity over time.
- If ledger history is not available yet, render a flat line from `market.created_at` to now at the current computed or neutral Yes chance. This is a calculated current-state visualization, not mock market data.
- Label the flat fallback honestly as current market balance/sentiment, not historical price movement.
- Show a line chart with a `0-100%` Y axis, a time X axis, and simple range toggles if practical.
- Never expose per-user positions or ledger rows in the UI; fetch or aggregate server-side and return only market-level totals/points.
- Do not weaken RLS or expose privileged keys.
- Keep the chart stable for tests.
- Use SVG/CSS or a small local component; do not add chart packages unless unavoidable.
- Keep the card layout consistent with the market list/detail pages.
- Make it responsive and light/dark compatible.

## Market Data And Mutation Rules

- Do not add a create market form.
- Do not add market creation UI.
- Do not add client-side insert/update/delete behavior for markets.
- Do not add user-owned markets.
- Do not add admin behavior in this step.
- Do not add buying, selling, trading, auth, settlement, or balance-changing behavior in this step.
- Markets should come from Supabase data created by the existing database setup.
- Do not create fake/mock market data in the UI or fallback code.
- Do not add new seed data, migrations, scripts, or hard-coded records that populate Supabase in this step.
- Test fixtures or mocked Supabase responses are okay for focused unit tests only.
- Run `task db:push` as part of this task to apply the existing database setup; do not stop to ask for confirmation first.

## Testing / Verification

If the repo already has a test setup, add focused tests for:

- rendering a list of markets
- empty market state
- status display
- close date display
- market detail page rendering
- market detail missing state or `notFound()` behavior
- probability chart rendering on the market detail page
- current Yes chance calculated from aggregate positions when available
- neutral `50%` baseline when aggregate positions are unavailable or empty
- flat current-state line when ledger history is unavailable
- closed market shows buying unavailable when the existing buy placeholder supports it
- existing market detail behavior still works
- theme toggle rendering
- no hero/template image rendered on the market pages

If adding tests is not practical yet, document a small manual verification path:

- run the app
- open the market list page
- confirm seeded markets appear
- confirm title, description, status, and close date are visible
- open a market detail page
- confirm market details are visible
- confirm the probability chart renders
- confirm the chart uses a computed or neutral Yes chance
- confirm the starter/template image is gone
- confirm light mode works
- confirm dark mode works
- confirm the pages work while signed out
- confirm the layout is responsive
