-- MarketLab core schema: profiles, markets, positions, ledger_entries

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (one-to-one with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- markets (binary Yes/No only)
-- ---------------------------------------------------------------------------

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open', 'closed', 'resolved')),
  close_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger markets_set_updated_at
  before update on public.markets
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- positions (one row per user per market)
-- ---------------------------------------------------------------------------

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  market_id uuid not null references public.markets (id) on delete cascade,
  yes_shares_cents bigint not null default 0 check (yes_shares_cents >= 0),
  no_shares_cents bigint not null default 0 check (no_shares_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, market_id)
);

create trigger positions_set_updated_at
  before update on public.positions
  for each row
  execute function public.set_updated_at();

create index positions_user_id_idx on public.positions (user_id);
create index positions_market_id_idx on public.positions (market_id);

-- ---------------------------------------------------------------------------
-- ledger_entries (balance audit trail)
-- ---------------------------------------------------------------------------

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  market_id uuid references public.markets (id) on delete set null,
  amount_cents bigint not null,
  entry_type text not null,
  description text,
  created_at timestamptz not null default now()
);

create index ledger_entries_user_id_idx on public.ledger_entries (user_id);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  starting_balance_cents constant bigint := 100000; -- $1,000.00 fake money
begin
  insert into public.profiles (id, balance_cents, first_name, last_name)
  values (
    new.id,
    starting_balance_cents,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Trigger functions are not API endpoints
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.positions enable row level security;
alter table public.ledger_entries enable row level security;

-- Markets: public read
create policy "Markets are publicly readable"
  on public.markets
  for select
  to anon, authenticated
  using (true);

-- Profiles: users read their own row; no client writes (balance changes via RPC later)
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Positions: users read their own rows
create policy "Users can read own positions"
  on public.positions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Ledger: users read their own rows
create policy "Users can read own ledger entries"
  on public.ledger_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- API grants (reads only from the browser; writes happen server-side later)
-- ---------------------------------------------------------------------------

grant select on public.markets to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.positions to authenticated;
grant select on public.ledger_entries to authenticated;
