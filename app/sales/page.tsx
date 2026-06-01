"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard-layout";

import {
  useInventoryStore,
} from "../../store/inventory-store";

import {
  useSalesStore,
} from "../../store/sales-store";

export default function SalesPage() {

  const products =
    useInventoryStore(
      (state) =>
        state.products
    );

  const updateStock =
    useInventoryStore(
      (state) =>
        state.updateStock
    );

  const fetchProducts =
    useInventoryStore(
      (state) =>
        state.fetchProducts
    );

  const createSale =
    useSalesStore(
      (state) =>
        state.createSale
    );

  const fetchSales =
    useSalesStore(
      (state) =>
        state.fetchSales
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

  useEffect(() => {
    fetchProducts();

    fetchSales();
  }, []);

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
        ) *
        Number(quantity || 0)
      : 0;

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

    await updateStock(
      selectedProduct.id,
      Number(quantity)
    );

    setSelectedProductId("");

    setQuantity("");
  }

  return (
    <DashboardLayout>
      <div className="p-4 space-y-8">

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Record Sale
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create and track product sales
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <span className="text-sm font-medium text-gray-500">Product</span>

            <select
              value={
                selectedProductId
              }
              onChange={(e) =>
                setSelectedProductId(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-black"
            >

              <option
                value=""
                className="text-gray-500"
              >
                Select Product
              </option>

              {products.map(
                (product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                    (
                    {product.stock}
                    {" "}
                    left)
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-black"
            />

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">

              <p className="text-sm text-blue-600">
                Total Amount
              </p>

              <h2 className="text-4xl font-bold text-blue-700 mt-2">
                TZS{" "}
                {total.toLocaleString()}
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">

              <p className="text-sm text-blue-600">
                Total Profit
              </p>

              <h2 className="text-4xl font-bold text-blue-700 mt-2">
                TZS{" "}
                {profit.toLocaleString()}
              </h2>
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
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl py-4 font-semibold hover:scale-[1.01] transition"
            >
              Record Sale
            </button>
          </form>
        </div>

        <div className="space-y-3">

          {sales.map((sale) => (

            <div
              key={sale.id}
              className="bg-white rounded-3xl p-5 shadow-sm border hover:shadow-md transition"
            >

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {sale.productName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Product Sale
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-500">
                    Revenue
                  </p>

                  <h2 className="text-2xl font-bold text-blue-600">
                    TZS{" "}
                    {sale.total.toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-500">
                    Quantity
                  </p>

                  <h3 className="text-lg font-bold mt-1 text-black">
                    {sale.quantity}
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-500">
                    Profit
                  </p>

                  <h3 className="text-lg font-bold mt-1 text-green-600">
                    TZS{" "}
                    {sale.profit.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <h3 className="text-sm font-semibold mt-1 text-black">
                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString()}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}