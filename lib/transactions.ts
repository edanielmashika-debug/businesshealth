import { supabase } from "./supabase";

export async function getTransactions() {
  const {
    data,
    error,
  } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);

    return [];
  }

  return data;
}

export async function createTransaction(
  transaction: {
    amount: number;

    category: string;

    type:
      | "income"
      | "expense";

    paymentMethod: string;
  }
) {
  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return;

  const { error } =
    await supabase
      .from("transactions")
      .insert({
        user_id: user.id,

        amount:
          transaction.amount,

        category:
          transaction.category,

        type: transaction.type,

        payment_method:
          transaction.paymentMethod,
      });

  if (error) {
    console.error(error);
  }
}

export async function deleteTransactionFromDB(
  id: string
) {
  const { error } =
    await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(error);
  }
}