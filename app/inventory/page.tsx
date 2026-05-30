"use client";

import DashboardLayout from "@/components/dashboard-layout";

import { useInventoryStore } from "@/store/inventory-store";

import { useState } from "react";
import { useEffect } from "react";

import {
  getProducts,
  createProduct,
} from "@/lib/inventory";

export default function InventoryPage() {
  const products =
    useInventoryStore(
      (state) =>
        state.products
    );

    const setProducts =
  useInventoryStore(
    (state) =>
      state.setProducts
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

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await createProduct({
  name,

  stock: Number(stock),

  buyPrice:
    Number(buyPrice),

  sellPrice:
    Number(sellPrice),
});

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


  useEffect(() => {
  async function loadProducts() {
    const data =
      await getProducts();

    if (!data) return;

    const formatted =
      data.map((product) => ({
        id: product.id,

        name: product.name,

        stock: product.stock,

        buyPrice: Number(
          product.buy_price
        ),

        sellPrice: Number(
          product.sell_price
        ),

        createdAt:
          product.created_at,
      }));

    setProducts(formatted);
  }

  loadProducts();
}, [setProducts]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-rose-950">
            Inventory
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your products
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border rounded-2xl p-5 bg-white space-y-4 ocean-general"
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
  key={product.id}
  className="bg-white rounded-3xl p-5 shadow-sm border hover:shadow-md transition"
>
  
  {/* TOP */}

  <div className="flex items-start justify-between">
    
    <div>
      <h2 className="text-xl font-bold text-gray-800">
        {product.name}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Product Inventory
      </p>
    </div>

    <div
      className={`
      px-3 py-1 rounded-full text-sm font-medium

      ${
        product.stock <= 5
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
      }
    `}
    >
      {product.stock <= 5
        ? "Low Stock"
        : "In Stock"}
    </div>
  </div>

  {/* STATS */}

  <div className="grid grid-cols-2 gap-4 mt-6">
    
    {/* BUYING */}

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-sm text-gray-500">
        Buying Price
      </p>

      <h3 className="text-lg font-bold mt-1 text-black">
        TZS{" "}
        {product.buyPrice.toLocaleString()}
      </h3>
    </div>

    {/* SELLING */}

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-sm text-gray-500">
        Selling Price
      </p>

      <h3 className="text-lg font-bold mt-1 text-black">
        TZS{" "}
        {product.sellPrice.toLocaleString()}
      </h3>
    </div>

    {/* STOCK */}

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-sm text-gray-500">
        Stock Left
      </p>

      <h3 className="text-lg font-bold mt-1 text-black">
        {product.stock}
      </h3>
    </div>

    {/* PROFIT */}

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-sm text-gray-500">
        Profit / Item
      </p>

      <h3 className="text-lg font-bold mt-1 text-green-600">
        TZS{" "}
        {(
          product.sellPrice -
          product.buyPrice
        ).toLocaleString()}
      </h3>
    </div>
  </div>

  {/* ACTIONS */}

  <div className="flex gap-3 mt-6">
    
    <button className="flex-1 bg-blue-600 text-white rounded-2xl py-3 hover:bg-blue-700 transition">
      Edit
    </button>

    <button className="flex-1 border rounded-2xl py-3 hover:bg-gray-50 transition text-red-500" onClick ={()=>deleteProduct}>
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