"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/dashboard-layout";
import {useTranslation} from "@/hooks/useTranslation";

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
  X,
  Sparkles,
  DollarSign,
} from "lucide-react";

export default function InventoryPage() {
  const t = useTranslation();
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

  const [showForm, setShowForm] =
    useState(false);

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

    setShowForm(false);
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

      <div className="space-y-8 pb-10">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 text-white shadow-2xl">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
                📦 Inventory Management
              </div>

              <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">
                Smart
                <br />
                {t.inventory}
              </h1>

              <p className="text-blue-100 mt-4 max-w-2xl text-lg">
                Organize products, monitor stock levels, and track inventory value in real-time.
              </p>

            </div>

            {/* ADD BUTTON */}

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="w-20 h-20 rounded-[2rem] bg-white text-blue-700 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
            >

              <Plus size={40} />

            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* PRODUCTS */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Products
                </p>

                <h2 className="text-4xl font-black mt-3 text-blue-600 dark:text-blue-400">
                  {totalProducts}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">

                <Package className="w-7 h-7 text-blue-600 dark:text-blue-400" />

              </div>

            </div>

          </div>

          {/* STOCK */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Total Stock
                </p>

                <h2 className="text-4xl font-black mt-3 text-purple-600 dark:text-purple-400">
                  {totalStock}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">

                <Boxes className="w-7 h-7 text-purple-600 dark:text-purple-400" />

              </div>

            </div>

          </div>

          {/* LOW STOCK */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Low Stock
                </p>

                <h2 className="text-4xl font-black mt-3 text-red-500">
                  {lowStockCount}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">

                <AlertTriangle className="w-7 h-7 text-red-500" />

              </div>

            </div>

          </div>

          {/* INVENTORY VALUE */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Inventory Value
                </p>

                <h2 className="text-3xl font-black mt-3 text-green-600 dark:text-green-400">
                  TZS{" "}
                  {totalInventoryValue.toLocaleString()}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">

                <DollarSign className="w-7 h-7 text-green-600 dark:text-green-400" />

              </div>

            </div>

          </div>

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
                  className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-2xl transition-all duration-300"
                >

                  {/* BACKGROUND GLOW */}

                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

                  <div className="relative z-10">

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                          <Sparkles className="w-3 h-3" />
                          Inventory Product
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 dark:text-white leading-tight">
                          {product.name}
                        </h2>

                      </div>

                      {isLowStock && (

                        <div className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-2xl text-sm font-bold">
                          Low Stock
                        </div>

                      )}

                    </div>

                    {/* STATS GRID */}

                    <div className="grid grid-cols-2 gap-4 mt-8">

                      <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/80 p-5 border border-gray-100 dark:border-slate-700">

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Stock Left
                        </p>

                        <h3 className="text-3xl font-black mt-2 text-black dark:text-white">
                          {product.stock}
                        </h3>

                      </div>

                      <div className="rounded-3xl bg-green-50 dark:bg-green-500/10 p-5 border border-green-100 dark:border-green-500/20">

                        <p className="text-sm text-green-600 dark:text-green-400">
                          Profit
                        </p>

                        <h3 className="text-2xl font-black mt-2 text-green-600 dark:text-green-400">
                          TZS{" "}
                          {profit.toLocaleString()}
                        </h3>

                      </div>

                      <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/80 p-5 border border-gray-100 dark:border-slate-700">

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Buying Price
                        </p>

                        <h3 className="text-xl font-black mt-2 text-black dark:text-white">
                          TZS{" "}
                          {product.buyPrice.toLocaleString()}
                        </h3>

                      </div>

                      <div className="rounded-3xl bg-blue-50 dark:bg-blue-500/10 p-5 border border-blue-100 dark:border-blue-500/20">

                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Selling Price
                        </p>

                        <h3 className="text-xl font-black mt-2 text-blue-600 dark:text-blue-400">
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
                      className="mt-6 w-full h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
                    >

                      <Trash2 className="w-5 h-5" />

                      Delete Product

                    </button>

                  </div>

                </div>
              );
            }
          )}
        </div>

      </div>

      {/* POPUP */}

      {showForm && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl relative">

            {/* TOP BAR */}

            <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-t-[2rem]" />

            {/* CLOSE */}

            <button
              onClick={() =>
                setShowForm(false)
              }
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
            >

              <X className="w-5 h-5" />

            </button>

            <div className="p-6 sm:p-8">

              {/* HEADER */}

              <div className="mb-8">

                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                  📦 Add Inventory
                </div>

                <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-5">
                  Add Product
                </h2>

                <p className="text-gray-500 dark:text-slate-400 mt-2">
                  Add new products into your inventory system
                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-5"
              >

                <div>

                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    Product Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    className="w-full mt-2 h-14 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
                  />

                </div>

                <div>

                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={stock}
                    onChange={(e) =>
                      setStock(
                        e.target.value
                      )
                    }
                    className="w-full mt-2 h-14 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Buying Price
                    </label>

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
                      className="w-full mt-2 h-14 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
                    />

                  </div>

                  <div>

                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Selling Price
                    </label>

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
                      className="w-full mt-2 h-14 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
                    />

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                >

                  <Plus className="w-5 h-5" />

                  Add Product

                </button>

              </form>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}