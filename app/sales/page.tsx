"use client";

import { useEffect, useState } from "react";

import { useInventoryStore } from "../../store/inventory-store";

import { useSalesStore } from "../../store/sales-store";
import DashboardLayout from "../../components/dashboard-layout";
import {
  updateProductStock,
} from "../../lib/inventory";

import {
  getSales,
  createSale,
} from "../../lib/sales";

export default function SalesPage() {
  const products =
    useInventoryStore(
      (state) =>
        state.products
    );



  const reduceStock =
    useInventoryStore(
      (state) =>
        state.reduceStock
    );

  const addSale =
    useSalesStore(
      (state) =>
        state.addSale
    );

  const setSales =
    useSalesStore(
      (state) =>
        state.setSales
    );

  const sales =
    useSalesStore(
      (state) =>
        state.sales
    );

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [quantity, setQuantity] =
    useState("");

  const selectedProduct =
    products.find(
      (product) =>
        product.id ===
        selectedProductId
    );

  const total =
    selectedProduct
      ? selectedProduct.sellPrice *
      Number(quantity || 0)
      : 0;

  const profit =
    selectedProduct
      ? (
        selectedProduct.sellPrice -
        selectedProduct.buyPrice
      ) * Number(quantity || 0)
      : 0;

  useEffect(() => {
    async function loadSales() {
      const data =
        await getSales();

      if (!data) return;

const formatted =
  data.map((sale) => ({
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
  }));

      setSales(formatted);
    }

    loadSales();
  }, [setSales]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !selectedProduct ||
      !quantity
    )
      return;

    if (
      Number(quantity) >
      selectedProduct.stock
    ) {
      alert(
        "Not enough stock"
      );

      return;
    }

    await createSale({
      productId:
        selectedProduct.id,

      productName:
        selectedProduct.name,

      quantity:
        Number(quantity),

      total,
      profit,
    });

    addSale({
      id: crypto.randomUUID(),

      productId:
        selectedProduct.id,

      productName:
        selectedProduct.name,

      quantity:
        Number(quantity),

      total,
      profit,

      createdAt:
        new Date().toISOString(),
    });

    reduceStock(
      selectedProduct.id,
      Number(quantity)
    );

    await updateProductStock(
      selectedProduct.id,

      selectedProduct.stock -
      Number(quantity)
    );

    setSelectedProductId("");

    setQuantity("");
  }

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">
          Sales
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <select
            value={
              selectedProductId
            }
            onChange={(e) =>
              setSelectedProductId(
                e.target.value
              )
            }
            className=" ocean-input w-full p-3"
          >
            <option value="">
              Select Product
            </option>

            {products.map(
              (product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}({product.stock} left)
                </option>
              )
            )}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            className="ocean-input w-full p-3"
          />

          <div className="ocean-card p-4">
            Total:
            {" "}
            {total.toLocaleString()}
            {" "}
            TZS
          </div>

          <div className="text-green-600">
            Profit:
            {" "}
            TZS{" "}
            {profit.toLocaleString()}
          </div>

          {selectedProduct && (
            <div className="ocean-card p-4">
              <div>
                Stock Left:
                {" "}
                {selectedProduct.stock}
              </div>

              {selectedProduct.stock <=
                5 && (
                  <div className="text-red-500 text-sm mt-2">
                    Low Stock Warning
                  </div>
                )}
            </div>
          )}

          <button
            type="submit"
            className="w-full text-white rounded-xl p-3"
          >
            Record Sale
          </button>
        </form>

        <div className="space-y-3">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="ocean-card p-4"
            >
              <div className="font-semibold">
                {sale.productName}
              </div>

              <div>
                Qty:
                {" "}
                {sale.quantity}
              </div>

              <div>
                TZS
                {" "}
                {sale.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}