import { supabase } from "./supabase";

export async function getSales() {
  const {
    data,
    error,
  } = await supabase
    .from("sales")
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

export async function createSale(
  sale: {
    productId: string;

    productName: string;

    quantity: number;

    total: number;
  }
) {
  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return;

  const { error } =
    await supabase
      .from("sales")
      .insert({
        user_id: user.id,

        product_id:
          sale.productId,

        product_name:
          sale.productName,

        quantity:
          sale.quantity,

        total: sale.total,
      });

  if (error) {
    console.error(error);
  }
}

export async function deleteSaleFromDB(
  id: string
) {
  const { error } =
    await supabase
      .from("sales")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(error);
  }
}