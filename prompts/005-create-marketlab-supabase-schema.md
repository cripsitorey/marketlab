# 005 - Create MarketLab Supabase Schema

Create the minimal Supabase database model for MarketLab.

Create exactly one Supabase migration for these tables:

- `profiles`
- `markets`
- `positions`
- `ledger_entries`

## Tables

`profiles`:

- one-to-one with `auth.users` using the user UUID
- stores fake balance in cents
- stores `first_name` text and `last_name` text
- new users receive a fake starting balance automatically
- on signup, copy `first_name` and `last_name` from Supabase auth user metadata into `profiles`
- keep names on `public.profiles` so the app can read them under RLS

`markets`:

- binary Yes/No markets only
- `title`
- `description`
- `status`
- `close_date`
- `created_at` / `updated_at` if consistent with the project

`positions`:

- one row per user per market
- `user_id`
- `market_id`
- `yes_shares_cents`
- `no_shares_cents`
- `created_at` / `updated_at` if consistent with the project

`ledger_entries`:

- `user_id`
- `market_id` nullable when appropriate
- `amount_cents`
- `entry_type`
- `description` or simple metadata if useful
- `created_at`

Workshop simplification: 1 fake cent spent = 1 share cent.

## RLS

- public users can read market data
- users can read their own profile
- users can read their own positions
- users can read their own ledger entries
- users must not be able to directly update their fake balance from the browser
- balance-changing writes should happen server-side later through RPC/server-side logic

## Profile Creation

Add the simplest safe trigger/function to create a profile when a new Supabase auth user is created.

Include the fake starting balance. Populate `first_name` and `last_name` from:

- `new.raw_user_meta_data ->> 'first_name'`
- `new.raw_user_meta_data ->> 'last_name'`

If metadata is missing, store empty strings or nulls consistently. Keep the SQL readable and workshop-friendly.

Auth signup expectation:

```ts
supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name,
      last_name,
    },
  },
});
```

## Verification

Include available commands from `Taskfile.yml`, such as `task db:push` and `task db:types`, if present.

## Migration Safety Rules

- Create exactly one Supabase migration file for this change.
- Run `supabase migration new create_marketlab_schema` only once.
- After creating the migration file, verify it is non-empty before writing SQL.
- Do not retry `supabase migration new` if the CLI hangs, stalls, or errors.
- Do not manually invent another timestamped migration filename.
- If the CLI fails or produces an empty migration file, stop and report the issue instead of creating a second migration file.
- Before running `task db:push`, confirm there is only one new migration file in `supabase/migrations/`.
- After pushing, confirm local and remote migration history match with `supabase migration list --linked`.
- Do not leave zero-byte `.sql` files in `supabase/migrations/`.
