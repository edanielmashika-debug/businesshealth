import { create } from "zustand";
import {
  deleteSaleFromDB,
} from "../lib/sales";

export interface Sale {
  id: string;

  productId: string;

  productName: string;

  quantity: number;

  total: number;

  profit: number;

  createdAt: string;
}

interface SalesStore {
  sales: Sale[];

  setSales: (
    sales: Sale[]
  ) => void;

  addSale: (
    sale: Sale
  ) => void;

  deleteSale: (
    id: string
  ) => void;
}

export const useSalesStore =
  create<SalesStore>(
    (set) => ({
      sales: [],

      setSales: (sales) =>
        set({
          sales,
        }),

      addSale: (sale) =>
        set((state) => ({
          sales: [
            sale,
            ...state.sales,
          ],
        })),

      deleteSale: async (
  id
) => {
  set((state) => ({
    sales:
      state.sales.filter(
        (sale) =>
          sale.id !== id
      ),
  }));

  await deleteSaleFromDB(
    id
  );
},
    })
  );