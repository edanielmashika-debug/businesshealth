
import { supabase } from "../lib/supabase";

export async function createTransaction(
  transaction: any
) {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return;

  return await supabase
    .from("transactions")
    .insert({
      id: transaction.id,

      user_id: user.id,

      title: transaction.title,

      amount:
        transaction.amount,

      category:
        transaction.category,

      type: transaction.type,

      source:
        transaction.source,

      created_at:
        transaction.createdAt,
    });
}

export async function getTransactions() {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return [];

  const { data } =
    await supabase
      .from("transactions")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  return data || [];
}

export async function deleteTransactionFromDB(
  id: string
) {

  return await supabase
    .from("transactions")
    .delete()
    .eq("id", id);
}

