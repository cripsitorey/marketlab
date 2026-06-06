import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileSummary = {
  balance_cents: number;
  first_name: string;
  last_name: string;
};

export const getCurrentUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getCurrentProfile = cache(
  async (): Promise<ProfileSummary | null> => {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    const supabase = await createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance_cents, first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();

    return profile;
  },
);
