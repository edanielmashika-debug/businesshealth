import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export type Sale = {
  id: string;

  productId: string;

  productName: string;

  quantity: number;

  total: number;

  profit: number;

  createdAt: string;
};

type SalesStore = {

  sales: Sale[];

  fetchSales: () => Promise<void>;

  createSale: (
    sale: Sale
  ) => Promise<void>;

  addSale: (
    sale: Sale
  ) => void;

  setSales: (
    sales: Sale[]
  ) => void;
};

export const useSalesStore =
  create<SalesStore>(
    (set, get) => ({

      sales: [],

      fetchSales:
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
              .from("sales")
              .select("*")
              .eq(
                "user_id",
                user.id
              )
              .order(
                "created_at",
                {
                  ascending:
                    false,
                }
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
                sale
              ) => ({
                id:
                  sale.id,

                productId:
                  sale.product_id,

                productName:
                  sale.product_name,

                quantity:
                  sale.quantity,

                total:
                  Number(
                    sale.total
                  ),

                profit:
                  Number(
                    sale.profit
                  ),

                createdAt:
                  sale.created_at,
              })
            );

          set({
            sales:
              formatted,
          });
        },

      createSale:
        async (
          sale
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
              .from("sales")
              .insert({
                id:
                  sale.id,

                product_id:
                  sale.productId,

                product_name:
                  sale.productName,

                quantity:
                  sale.quantity,

                total:
                  sale.total,

                profit:
                  sale.profit,

                created_at:
                  sale.createdAt,

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
            sales: [
              sale,
              ...get()
                .sales,
            ],
          });
        },

      addSale:
        (
          sale
        ) => {

          set({
            sales: [
              sale,
              ...get()
                .sales,
            ],
          });
        },

      setSales:
        (
          sales
        ) => {

          set({
            sales,
          });
        },
    })
  );