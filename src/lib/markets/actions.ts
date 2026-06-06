"use server";

import { revalidatePath } from "next/cache";

import { parseFakeDollarInput } from "@/lib/fake-money";
import type { MarketSide } from "@/lib/positions/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type BuyMarketState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      balanceCents: number;
      yesSharesCents: number;
      noSharesCents: number;
    };

const ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "Sign in to buy shares with fake money.",
  invalid_amount: "Enter a positive fake dollar amount.",
  invalid_side: "Choose Yes or No before buying.",
  market_not_found: "This market could not be found.",
  market_not_buyable:
    "Buying is unavailable because this market is closed, resolved, or past its close date.",
  profile_not_found: "Your profile could not be found.",
  insufficient_balance: "You do not have enough fake money for this purchase.",
};

function mapBuyError(message: string): string {
  for (const [code, friendly] of Object.entries(ERROR_MESSAGES)) {
    if (message.includes(code)) {
      return friendly;
    }
  }

  return "Something went wrong while buying shares. Please try again.";
}

function isMarketSide(value: string): value is MarketSide {
  return value === "yes" || value === "no";
}

export async function buyMarketShares(
  _prev: BuyMarketState,
  formData: FormData,
): Promise<BuyMarketState> {
  const marketId = formData.get("market_id");
  const side = formData.get("side");
  const amount = formData.get("amount");

  if (typeof marketId !== "string" || !marketId) {
    return { status: "error", message: "Market is required." };
  }

  if (typeof side !== "string" || !isMarketSide(side)) {
    return { status: "error", message: ERROR_MESSAGES.invalid_side };
  }

  if (typeof amount !== "string") {
    return { status: "error", message: ERROR_MESSAGES.invalid_amount };
  }

  const parsedAmount = parseFakeDollarInput(amount);
  if (!parsedAmount.ok) {
    return { status: "error", message: parsedAmount.error };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: ERROR_MESSAGES.not_authenticated };
  }

  const { data, error } = await supabase.rpc("buy_market_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: parsedAmount.cents,
  });

  if (error) {
    return { status: "error", message: mapBuyError(error.message) };
  }

  const result = data as {
    balance_cents: number;
    yes_shares_cents: number;
    no_shares_cents: number;
  };

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/positions");
  revalidatePath("/", "layout");

  return {
    status: "success",
    balanceCents: result.balance_cents,
    yesSharesCents: result.yes_shares_cents,
    noSharesCents: result.no_shares_cents,
  };
}
