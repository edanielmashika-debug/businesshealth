"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/dashboard-layout";

import {
  useInventoryStore,
} from "@/store/inventory-store";

import {
  Package,
  TrendingUp,
  AlertTriangle,
  Boxes,
  Trash2,
  Plus,
} from "lucide-react";

export default function InventoryPage() {

  const {
    products,
    addProduct,
    deleteProduct,
    fetchProducts,
  } =
    useInventoryStore();

  const [name, setName] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [
    buyingPrice,
    setBuyingPrice,
  ] = useState("");

  const [
    sellingPrice,
    setSellingPrice,
  ] = useState("");

  useEffect(() => {

    fetchProducts();

  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !name ||
      !stock ||
      !buyingPrice ||
      !sellingPrice
    )
      return;

    await addProduct({

      id:
        crypto.randomUUID(),

      name,

      stock:
        Number(stock),

      buyPrice:
        Number(
          buyingPrice
        ),

      sellPrice:
        Number(
          sellingPrice
        ),
    });

    setName("");
    setStock("");
    setBuyingPrice("");
    setSellingPrice("");
  };

  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        product.stock,
      0
    );

  const lowStockCount =
    products.filter(
      (product) =>
        product.stock <= 5
    ).length;

  const totalInventoryValue =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        (
          product.stock *
          product.sellPrice
        ),
      0
    );

  return (

    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Inventory
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your business products and stock
          </p>
        </div>

        {/* TOP STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* PRODUCTS */}

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Products
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalProducts}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <Package />
              </div>
            </div>
          </div>

          {/* STOCK */}

          <div className="bg-gradient-to-br from-purple-500 to-violet-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Total Stock
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalStock}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <Boxes />
              </div>
            </div>
          </div>

          {/* LOW STOCK */}

          <div className="bg-gradient-to-br from-red-500 to-rose-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Low Stock
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {lowStockCount}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <AlertTriangle />
              </div>
            </div>
          </div>

          {/* INVENTORY VALUE */}

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Inventory Value
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  TZS{" "}
                  {totalInventoryValue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <TrendingUp />
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-800">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Product
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Add products to your inventory
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
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
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
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
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
            />

            <input
              type="number"
              placeholder="Buying price"
              value={
                buyingPrice
              }
              onChange={(e) =>
                setBuyingPrice(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
            />

            <input
              type="number"
              placeholder="Selling price"
              value={
                sellingPrice
              }
              onChange={(e) =>
                setSellingPrice(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold shadow-lg flex items-center justify-center gap-3"
            >

              <Plus className="w-5 h-5" />

              Add Product
            </button>
          </form>
        </div>

        {/* PRODUCTS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {products.map(
            (product) => {

              const profit =
                product.sellPrice -
                product.buyPrice;

              const isLowStock =
                product.stock <= 5;

              return (

                <div
                  key={
                    product.id
                  }
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-md transition"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {
                          product.name
                        }
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        Inventory Product
                      </p>
                    </div>

                    {isLowStock && (

                      <div className="bg-red-100 dark:bg-red-900/40 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">

                        Low Stock
                      </div>
                    )}
                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-2 gap-4 mt-6">

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Stock Left
                      </p>

                      <h3 className="text-xl font-bold mt-1 text-black dark:text-white">
                        {
                          product.stock
                        }
                      </h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Profit
                      </p>

                      <h3 className="text-xl font-bold mt-1 text-green-600">
                        TZS{" "}
                        {profit.toLocaleString()}
                      </h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Buying Price
                      </p>

                      <h3 className="text-lg font-bold mt-1 text-black dark:text-white">
                        TZS{" "}
                        {product.buyPrice.toLocaleString()}
                      </h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Selling Price
                      </p>

                      <h3 className="text-lg font-bold mt-1 text-blue-600">
                        TZS{" "}
                        {product.sellPrice.toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteProduct(
                        product.id
                      )
                    }
                    className="mt-6 w-full bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl py-3 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-2"
                  >

                    <Trash2 className="w-4 h-4" />

                    Delete Product
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}