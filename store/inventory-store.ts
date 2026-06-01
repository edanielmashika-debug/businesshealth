import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;

  name: string;

  stock: number;

  buyPrice: number;

  sellPrice: number;
};

type InventoryStore = {

  products: Product[];

  fetchProducts: () => Promise<void>;

  addProduct: (
    product: Product
  ) => Promise<void>;

  deleteProduct: (
    id: string
  ) => Promise<void>;

  reduceStock: (
    id: string,
    quantity: number
  ) => Promise<void>;

  updateStock: (
    id: string,
    stock: number
  ) => Promise<void>;
};

export const useInventoryStore =
  create<InventoryStore>(
    (set, get) => ({

      products: [],

      fetchProducts:
        async () => {

          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) return;

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "inventory"
              )
              .select("*")
              .eq(
                "user_id",
                user.id
              );

          if (
            error ||
            !data
          ) {
            console.error(
              error
            );

            return;
          }

          const formatted =
            data.map(
              (
                product
              ) => ({
                id:
                  product.id,

                name:
                  product.name,

                stock:
                  product.stock,

                buyPrice:
                  Number(
                    product.buy_price
                  ),

                sellPrice:
                  Number(
                    product.sell_price
                  ),
              })
            );

          set({
            products:
              formatted,
          });
        },

      addProduct:
        async (
          product
        ) => {

          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) return;

          const {
            error,
          } =
            await supabase
              .from(
                "inventory"
              )
              .insert({
                id:
                  product.id,

                name:
                  product.name,

                stock:
                  product.stock,

                buy_price:
                  product.buyPrice,

                sell_price:
                  product.sellPrice,

                user_id:
                  user.id,
              });

          if (error) {
            console.error(
              error
            );

            return;
          }

          set({
            products: [
              ...get()
                .products,
              product,
            ],
          });
        },

      deleteProduct:
        async (
          id
        ) => {

          const {
            error,
          } =
            await supabase
              .from(
                "inventory"
              )
              .delete()
              .eq(
                "id",
                id
              );

          if (error) {
            console.error(
              error
            );

            return;
          }

          set({
            products:
              get().products.filter(
                (
                  product
                ) =>
                  product.id !==
                  id
              ),
          });
        },

      reduceStock:
        async (
          id,
          quantity
        ) => {

          const product =
            get().products.find(
              (
                product
              ) =>
                product.id ===
                id
            );

          if (!product)
            return;

          const newStock =
            product.stock -
            quantity;

          await supabase
            .from(
              "inventory"
            )
            .update({
              stock:
                newStock,
            })
            .eq(
              "id",
              id
            );

          set({
            products:
              get().products.map(
                (
                  product
                ) =>
                  product.id ===
                  id
                    ? {
                        ...product,
                        stock:
                          newStock,
                      }
                    : product
              ),
          });
        },

      updateStock:
        async (
          id,
          stock
        ) => {

          const {
            error,
          } =
            await supabase
              .from(
                "inventory"
              )
              .update({
                stock,
              })
              .eq(
                "id",
                id
              );

          if (error) {
            console.error(
              error
            );

            return;
          }

          set({
            products:
              get().products.map(
                (
                  product
                ) =>
                  product.id ===
                  id
                    ? {
                        ...product,
                        stock,
                      }
                    : product
              ),
          });
        },
    })
  );