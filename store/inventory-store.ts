import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface InventoryStore {
    products: Product[];

    addProduct: (
        product: Product
    ) => void;

    deleteProduct: (
        id: string
    )=> void;

}

export const useInventoryStore = 
   create<InventoryStore>()(
     persist(
        (set)=>({
            products: [],
            
            addProduct: (
                product
            )=>
                set((state)=>({
                    products: [
                        product,
                        ...state.products,
                    ],
                })),
             deleteProduct: (
                id
             )=>
                set((state)=>({
                    products:
                      state.products.filter(
                        (product) =>
                            product.id !== id
                      ),
                })),

            
        }),
        {
         name:
          "inventory-storage",
        }
     )
   );