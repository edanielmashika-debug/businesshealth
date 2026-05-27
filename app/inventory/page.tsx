"use client";

import DashboardLayout from "@/components/dashboard-layout";

import { useInventoryStore } from "@/store/inventory-store";

import { useState } from "react";

export default function InventoryPage() {
  const products =
    useInventoryStore(
      (state) =>
        state.products
    );

  const addProduct =
    useInventoryStore(
      (state) =>
        state.addProduct
    );

  const deleteProduct =
    useInventoryStore(
      (state) =>
        state.deleteProduct
    );

  const [name, setName] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [buyPrice, setBuyPrice] =
    useState("");

  const [sellPrice, setSellPrice] =
    useState("");

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    addProduct({
      id: crypto.randomUUID(),

      name,

      stock: Number(stock),

      buyPrice:
        Number(buyPrice),

      sellPrice:
        Number(sellPrice),

      createdAt:
        new Date().toISOString(),
    });

    setName("");

    setStock("");

    setBuyPrice("");

    setSellPrice("");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Inventory
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your products
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border rounded-2xl p-5 bg-white space-y-4"
        >
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Stock quantity"
            value={stock}
            onChange={(e) =>
              setStock(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Buying price"
            value={buyPrice}
            onChange={(e) =>
              setBuyPrice(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Selling price"
            value={sellPrice}
            onChange={(e) =>
              setSellPrice(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl touch-manipulation"
          >
            Add Product
          </button>
        </form>

        <div className="grid gap-4">
          {products.map(
            (product) => (
              <div
                key={
                  product.id
                }
                className="border rounded-2xl p-5 bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg">
                      {
                        product.name
                      }
                    </h2>

                    <p className="text-gray-500">
                      Stock:
                      {
                        product.stock
                      }
                    </p>

                    <p className="text-gray-500">
                      Buy:
                      TZS
                      {
                        product.buyPrice
                      }
                    </p>

                    <p className="text-gray-500">
                      Sell:
                      TZS
                      {
                        product.sellPrice
                      }
                    </p>

                    <p className="font-semibold mt-2">
                      Profit:
                      TZS
                      {` `}
                      {product.sellPrice -
                        product.buyPrice}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      deleteProduct(
                        product.id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-2 rounded-lg touch-manipulation"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}