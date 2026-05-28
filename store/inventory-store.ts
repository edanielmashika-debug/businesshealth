import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import {
  deleteProductFromDB,
} from "@/lib/inventory";

interface InventoryStore {
    products: Product[];

    addProduct: (
        product: Product
    ) => void;

    deleteProduct: (
        id: string
    )=> Promise<void>;

    setProducts: (
  products: Product[]
) => void;

}

export const useInventoryStore = 
   create<InventoryStore>()(
     persist(
        (set)=>({
            products: [],

            setProducts: (
  products
) =>
  set({
    products,
  }),
            
            addProduct: (
                product
            )=>
                set((state)=>({
                    products: [
                        product,
                        ...state.products,
                    ],
                })),
  deleteProduct: async (
  id
) => {
  set((state) => ({
    products:
      state.products.filter(
        (product) =>
          product.id !== id
      ),
  }));

  await deleteProductFromDB(
    id
  );
},

            
        }),
        {
         name:
          "inventory-storage",
        }
     )
   );