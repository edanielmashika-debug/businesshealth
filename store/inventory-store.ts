"use client";

import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;

  name: string;

  stock: number;

  buyingPrice: number;

  sellingPrice: number;
};

type InventoryStore = {
  products: Product[];

  addProduct: (
    product: Product
  ) => Promise<void>;

  deleteProduct: (
    id: string
  ) => Promise<void>;

  updateStock: (
    id: string,
    quantitySold: number
  ) => Promise<void>;

  fetchProducts: () => Promise<void>;
};

export const useInventoryStore =
  create<InventoryStore>(
    (set, get) => ({
      products: [],

      fetchProducts:
        async () => {

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "inventory"
              )
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
              (
                product
              ) => ({
                id: product.id,

                name:
                  product.name,

                stock:
                  product.stock,

                buyingPrice:
                  Number(
                    product.buying_price
                  ),

                sellingPrice:
                  Number(
                    product.selling_price
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
            error,
          } =
            await supabase
              .from(
                "inventory"
              )
              .insert({
                id: product.id,

                name:
                  product.name,

                stock:
                  product.stock,

                buying_price:
                  product.buyingPrice,

                selling_price:
                  product.sellingPrice,
              });

          if (error) {
            console.error(
              error
            );

            return;
          }

          set((state) => ({
            products: [
              product,
              ...state.products,
            ],
          }));
        },

      deleteProduct:
        async (id) => {

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

          set((state) => ({
            products:
              state.products.filter(
                (
                  product
                ) =>
                  product.id !==
                  id
              ),
          }));
        },

      updateStock:
        async (
          id,
          quantitySold
        ) => {

          const product =
            get().products.find(
              (p) =>
                p.id === id
            );

          if (!product)
            return;

          const newStock =
            product.stock -
            quantitySold;

          const {
            error,
          } =
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

          if (error) {
            console.error(
              error
            );

            return;
          }

          set((state) => ({
            products:
              state.products.map(
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
          }));
        },
    })
  );