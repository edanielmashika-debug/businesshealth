"use client";

import { create } from "zustand";

import { supabase } from "../lib/supabase";

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

  createSale: (
    sale: Sale
  ) => Promise<void>;

  deleteSale: (
    id: string
  ) => Promise<void>;

  fetchSales: () => Promise<void>;
};

export const useSalesStore =
  create<SalesStore>(
    (set) => ({
      sales: [],

      fetchSales:
        async () => {

          const {
            data,
            error,
          } =
            await supabase
              .from("sales")
              .select("*")
              .order(
                "created_at",
                {
                  ascending:
                    false,
                }
              );

          if (error) {
            console.error(
              error
            );

            return;
          }

          const formatted =
            data.map(
              (sale) => ({
                id: sale.id,

                productId:
                  sale.product_id,

                productName:
                  sale.product_name,

                quantity:
                  sale.quantity,

                total: Number(
                  sale.total
                ),

                profit: Number(
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
        async (sale) => {

          const {
            error,
          } =
            await supabase
              .from("sales")
              .insert({
                id: sale.id,

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
              });

          if (error) {
            console.error(
              error
            );

            return;
          }

          set((state) => ({
            sales: [
              sale,
              ...state.sales,
            ],
          }));
        },

      deleteSale:
        async (id) => {

          const {
            error,
          } =
            await supabase
              .from("sales")
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

          set((state) => ({
            sales:
              state.sales.filter(
                (
                  sale
                ) =>
                  sale.id !==
                  id
              ),
          }));
        },
    })
  );