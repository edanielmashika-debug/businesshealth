import { supabase } from "./supabase";

export async function deleteAccount() {
  const session =
    await supabase.auth.getSession();

  const token =
    session.data.session
      ?.access_token;

  if (!token) return;

  const response =
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.json();
}