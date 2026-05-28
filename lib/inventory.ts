import { supabase } from "./supabase";

export async function getProducts() {
  const {
    data,
    error,
  } = await supabase
    .from("inventory")
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

export async function createProduct(
  product: {
    name: string;

    stock: number;

    buyPrice: number;

    sellPrice: number;
  }
) {
  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return;

  const { error } =
    await supabase
      .from("inventory")
      .insert({
        user_id: user.id,

        name: product.name,

        stock: product.stock,

        buy_price:
          product.buyPrice,

        sell_price:
          product.sellPrice,
      });

  if (error) {
    console.error(error);
  }
}

export async function deleteProductFromDB(
  id: string
) {
  const { error } =
    await supabase
      .from("inventory")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(error);
  }
}