import { supabase } from "@/lib/supabase";

import { Transaction } from "@/types/transaction";

export async function createTransaction(
  transaction: Transaction
) {
  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data, error } =
    await supabase
      .from("transactions")
      .insert({
        id: transaction.id,

        user_id: user.id,

        type: transaction.type,

        amount: transaction.amount,

        category:
          transaction.category,

        source:
          transaction.source,
      });

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getTransactions() {
  const { data, error } =
    await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
  if (error) {
    console.error(error);

    return [];
  }

  return data;
}