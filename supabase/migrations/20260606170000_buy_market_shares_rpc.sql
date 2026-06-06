-- Atomic fake-money buy: deduct balance, upsert position, write ledger entry.
-- Uses auth.uid() only; never trusts client-supplied user_id.

create or replace function public.buy_market_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_balance bigint;
  v_market record;
  v_yes_shares bigint;
  v_no_shares bigint;
  v_entry_type text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'invalid_amount';
  end if;

  if p_side is distinct from 'yes' and p_side is distinct from 'no' then
    raise exception 'invalid_side';
  end if;

  select id, status, close_date
  into v_market
  from public.markets
  where id = p_market_id;

  if not found then
    raise exception 'market_not_found';
  end if;

  if v_market.status is distinct from 'open' or v_market.close_date <= now() then
    raise exception 'market_not_buyable';
  end if;

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    raise exception 'profile_not_found';
  end if;

  if v_balance < p_amount_cents then
    raise exception 'insufficient_balance';
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id;

  if p_side = 'yes' then
    v_entry_type := 'buy_yes';
    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, p_amount_cents, 0)
    on conflict (user_id, market_id) do update
    set yes_shares_cents = public.positions.yes_shares_cents + excluded.yes_shares_cents;
  else
    v_entry_type := 'buy_no';
    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, 0, p_amount_cents)
    on conflict (user_id, market_id) do update
    set no_shares_cents = public.positions.no_shares_cents + excluded.no_shares_cents;
  end if;

  select yes_shares_cents, no_shares_cents
  into v_yes_shares, v_no_shares
  from public.positions
  where user_id = v_user_id
    and market_id = p_market_id;

  insert into public.ledger_entries (user_id, market_id, amount_cents, entry_type, description)
  values (
    v_user_id,
    p_market_id,
    p_amount_cents,
    v_entry_type,
    format('Bought %s shares with fake money', initcap(p_side))
  );

  return jsonb_build_object(
    'balance_cents', v_balance - p_amount_cents,
    'yes_shares_cents', v_yes_shares,
    'no_shares_cents', v_no_shares
  );
end;
$$;

revoke all on function public.buy_market_shares(uuid, text, bigint) from public;
revoke all on function public.buy_market_shares(uuid, text, bigint) from anon;
grant execute on function public.buy_market_shares(uuid, text, bigint) to authenticated;
