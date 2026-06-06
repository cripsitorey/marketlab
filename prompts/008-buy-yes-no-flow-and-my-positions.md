# 008 - Buy Yes / No Flow + My Positions View

Build the complete fake-money Buy Yes / No flow and the My Positions page in one pass.

Assume Supabase is linked and the schema, seed markets, market list/detail pages, auth UI, and profile balance display already exist. Follow `AGENTS.md`, reuse existing patterns, and keep the implementation small, readable, and workshop-friendly.

## Outcome

Signed-in users should be able to buy Yes or No shares with fake money from a market detail page, then use My Positions to see every market where they hold a position. The buy flow and positions view must use real Supabase data, respect auth/RLS, and avoid language that sounds like real investing, gambling, or trading advice.

Implement in this order:

1. Server-safe fake-money buy mutation.
2. Market detail buy UI.
3. My Positions page and header navigation.
4. Focused verification and manual test notes where automation is not practical.

## Client / Server Boundary

`MarketBuyForm` is a Client Component. Its import tree must not reach `next/headers`, `cookies()`, or `@/lib/supabase/server`.

- Keep server-only Supabase reads/writes in server-only modules.
- Keep client-safe formatting/parsing in a shared module like `src/lib/fake-money.ts`.
- Keep client-safe shared types in modules with no server imports.
- Render the buy form from a Server Component section that loads auth, balance, and position, then passes plain props to the client form.
- Fetch positions from Supabase using the authenticated user context, not client-provided user IDs.
- Before finishing, trace imports from `market-buy-form.tsx` and confirm none reach server-only APIs.

## Money Model

Users enter fake dollars in the UI, but the database stores cents.

- Display balances and share amounts as fake dollars, e.g. `$10.00 fake`.
- Accept inputs like `1`, `1.50`, and `10.00`.
- Reject more than two decimal places.
- Convert dollar strings to integer cents server-side.
- Do not use floating point math for balance-changing logic.
- Rule: **1 fake cent spent = 1 share cent**.

## Buy Flow

Add or complete the buy form on `/markets/[id]`.

Signed-in users can:

- choose **Yes** or **No**
- enter fake dollars
- see available fake balance
- submit a buy
- see pending, success, and error states
- avoid duplicate submissions while submitting
- see updated balance and position after success
- navigate to My Positions and see the new or updated position reflected there

Signed-out users should be asked to sign in. Closed, resolved, draft, missing, or expired markets are not buyable.

Use real Supabase data from the existing schema and seed data. Do not use fake client mock data for markets, balances, positions, or ledger state.

Keep copy clear that this uses fake money. Keep the form responsive, light/dark compatible, accessible, and consistent with the market detail page.

## Server Mutation

The buy must happen server-side.

Validate:

- authenticated user
- market exists, is open, and is not past `close_date`
- side is `yes` or `no`
- amount converts to a positive integer cent amount
- user has enough fake balance

On success:

- deduct balance
- create or update the user's position
- increase `yes_shares_cents` or `no_shares_cents`
- create a `ledger_entries` row
- return useful success/error results
- refresh affected UI so balance, market position, and My Positions are current

Prefer an atomic Supabase RPC using `auth.uid()`, called through a Server Action if that matches the project pattern. Server-side validation is the source of truth.

Do not trust `user_id` from the client, expose privileged keys, allow direct browser writes to balances/positions/ledger entries, or allow concurrent buys to make balances negative. Do not add selling, dynamic pricing, settlement, market creation, order books, AMMs, payments, or admin features.

## My Positions Page

Create a My Positions page where signed-in users can see only the markets they have positions in.

Requirements:

- Add header navigation to My Positions.
- Signed-in users see only their own positions.
- Signed-out users see a clear sign-in message and no private position data.
- Fetch positions from Supabase using the authenticated user context.
- Include related market information.
- Link each position back to the market detail page.
- Show a good empty state when the user has no positions.
- Rely on RLS so users can only read their own positions.
- Do not expose another user's positions.
- Do not add client-side insert/update/delete behavior for positions.

Each position should show:

- market title
- market status
- market close date
- Yes shares
- No shares
- total shares, computed from Yes shares plus No shares

## Design

- Use a clean dashboard-style layout.
- Use simple cards or a compact table, whichever fits the existing UI better.
- Keep styling consistent with the rest of the app.
- Make it responsive and light/dark compatible.
- Keep copy clear that this workshop app uses fake money only.
- Do not add charts, images, decorative hero sections, or marketing-style content.

## Verification

Add focused tests where practical for:

- invalid amounts
- invalid side
- signed-out buy state
- signed-out My Positions state
- closed/expired markets
- overspending
- duplicate submissions
- Yes/No position updates
- balance deduction
- ledger creation
- UI refresh after buy success
- `user_id` spoofing
- empty positions state
- rendering positions with Yes shares
- rendering positions with No shares
- displaying total shares from Yes shares plus No shares
- linking positions back to market detail pages
- not exposing positions for another user, if practical

Run `task verify`. If adding an RPC/migration, run `task db:push` then `task db:types`. Confirm `/markets/[id]` loads without a `next/headers` error from the buy form.

If automated database/RPC/UI tests are not practical, document a short manual path:

- run the app
- sign in
- buy Yes shares in an open market
- buy No shares in an open market
- confirm fake balance decreases
- confirm market detail position increases
- open My Positions
- confirm the market appears
- confirm Yes/No shares are shown correctly
- confirm total shares are shown correctly
- confirm the position links back to the market detail page
- confirm invalid amount rejection
- confirm overspend rejection
- confirm closed market state
- sign out
- confirm buy controls request sign-in
- confirm positions are not visible
