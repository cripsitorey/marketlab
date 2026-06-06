# 007 - Auth-Aware UI And Profile Balance

Build the auth-aware UI needed for users to sign in, sign up, sign out, and see their fake-money balance.

Assume Supabase is linked and the schema, seed markets, market list page, market detail page, and profile creation flow already exist. Follow `AGENTS.md`, use the existing Supabase client patterns, and keep the clean dashboard design with light/dark theme support.

## Auth UI

- Support signed-out and signed-in states.
- Add the smallest reasonable email/password sign-in and signup flow for the workshop if one does not already exist.
- After successful sign-in or signup, the app should reflect the authenticated state immediately.
- After signup, if Supabase returns a session, treat the user as signed in and show the signed-in header.
- If Supabase requires email confirmation and no session is returned, show a clear "check your email" state instead.
- Pass `first_name` and `last_name` through Supabase signup metadata so profile creation works.
- Allow signed-in users to sign out.
- Do not show signed-out actions like "Sign in" or "Sign up" after the user is authenticated.
- Do not add social login or extra auth features.

## Header

Update the app header to be auth-aware:

- Signed-out users see sign-in/sign-up actions.
- Signed-in users see their fake balance and a sign-out action.
- Keep the existing theme toggle.
- Keep navigation simple.
- Include the markets link.
- Include "my positions" only if that route already exists.
- Make signed-in and signed-out states look intentional in light and dark mode.

## Profile Balance

- Fetch the current user's profile.
- Display fake balance clearly, for example `1000 fake cents` or `$10.00 fake`.
- Handle missing profile state cleanly.
- Do not let users edit their balance from the browser.

## Security

- Do not expose privileged Supabase keys to the browser.
- Rely on RLS for owner-scoped profile reads.
- Do not add balance-changing writes.
- Leave buying, selling, pricing, settlement, and market creation for later prompts.

## Testing / Verification

If the repo already has a test setup, add focused tests for:

- signed-out header state
- signed-in header state
- signup or sign-in updates the visible auth state
- fake balance display
- sign-out action rendering
- missing profile state if applicable
- theme toggle still rendering

If adding tests is not practical yet, document a small manual verification path:

- run the app
- open the market list page signed out
- confirm sign-in/sign-up UI appears
- sign in or create a user
- confirm the header changes to the signed-in state
- confirm sign-in/sign-up actions disappear after authentication
- confirm fake balance appears
- confirm sign-out works
- confirm light mode still works
- confirm dark mode still works
- confirm users cannot edit their balance from the UI
