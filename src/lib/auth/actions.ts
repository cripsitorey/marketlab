"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirectWithError("/sign-in", "Email and password are required.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError("/sign-in", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/markets");
}

export async function signUp(formData: FormData) {
  const firstName = formData.get("first_name");
  const lastName = formData.get("last_name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    redirectWithError("/sign-up", "All fields are required.");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    redirectWithError("/sign-up", error.message);
  }

  if (!data.session) {
    redirect("/sign-up?check-email=1");
  }

  revalidatePath("/", "layout");
  redirect("/markets");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/markets");
}
