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

import {useTranslation} from "../../hooks/useTranslation";


import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  CalendarDays,
  Plus,
  X,
  Sparkles,
} from "lucide-react";

import {toast} from "sonner";
import { useLanguageStore } from "../../store/language-store";

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

  const [showForm, setShowForm] =
    useState(false);

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

      toast.error(
        "Not enough stock"
      );

      return;
    }

    await createSale({

      id:
        crypto.randomUUID(),

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

    setShowForm(false);
  }

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const totalProfit =
    sales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );


    const t = useTranslation();
  return (

    <DashboardLayout>

      <div className="space-y-8 pb-10">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 text-white shadow-2xl">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">

                <Sparkles className="w-4 h-4" />

                {t.salesDashboard}

              </div>

              <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">

                {t.trackProductSales}
                <br />
                {t.productSale}

              </h1>

              <p className="text-blue-100 mt-4 max-w-2xl text-lg">

                {t.salesDescription}

              </p>

            </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* REVENUE */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <p className="text-sm text-gray-500 dark:text-slate-400">
                {t.totalRevenue}
              </p>

              <h2 className="text-4xl font-black mt-3 text-blue-600 dark:text-blue-400">
                TZS {totalRevenue.toLocaleString()}
              </h2>

            </div>

          </div>

          {/* PROFIT */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <p className="text-sm text-gray-500 dark:text-slate-400">
                {t.totalProfit}
              </p>

              <h2 className="text-4xl font-black mt-3 text-green-600">
                TZS {totalProfit.toLocaleString()}
              </h2>

            </div>

          </div>

          {/* SALES COUNT */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <p className="text-sm text-gray-500 dark:text-slate-400">
                {t.salesCount}
              </p>

              <h2 className="text-4xl font-black mt-3 text-purple-600 dark:text-purple-400">
                {sales.length}
              </h2>

            </div>

          </div>

        </div>

        {/* SALES LIST */}

        <div className="space-y-5">

          {sales.map((sale) => (

            <div
              key={sale.id}
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition"
            >

              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

              <div className="relative z-10">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                  <div>

                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">

                      <ShoppingCart className="w-4 h-4" />

                      {t.productSale}

                    </div>

                    <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-4">

                      {sale.productName}

                    </h2>

                  </div>

                  <div className="text-left lg:text-right">

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {t.revenue}
                    </p>

                    <h2 className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">

                      TZS {sale.total.toLocaleString()}

                    </h2>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

                  <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5">

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                       {t.quantitySold}
                    </p>

                    <h3 className="text-2xl font-bold mt-2 text-black dark:text-white">

                      {sale.quantity}

                    </h3>

                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 rounded-3xl p-5 border border-green-100 dark:border-green-900">

                    <p className="text-sm text-green-600 dark:text-green-400">
                      {t.profitEarned}
                    </p>

                    <h3 className="text-2xl font-bold mt-2 text-green-600 dark:text-green-400">

                      TZS {sale.profit.toLocaleString()}

                    </h3>

                  </div>

                  <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5">

                    <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">

                      <CalendarDays className="w-4 h-4" />

                      {t.saleDate}

                    </p>

                    <h3 className="text-sm font-semibold mt-2 text-black dark:text-white">

                      {new Date(
                        sale.createdAt
                      ).toLocaleDateString()}

                    </h3>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* POPUP */}

      {
        showForm && (

          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

            <div className="w-full max-w-3xl max-h-[92vh] overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl relative">

              {/* SCROLLABLE */}

              <div className="max-h-[92vh] overflow-y-auto">

                {/* HEADER */}

                <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 p-6 flex items-center justify-between">

                  <div>

                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                      {t.recordSale}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {t.createAndTrackSales}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setShowForm(false)
                    }
                    className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
                  >

                    <X size={22} />

                  </button>

                </div>

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-6"
                >

                  <div>

                    <label className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      {t.product}
                    </label>

                    <select
                      value={selectedProductId}
                      onChange={(e) =>
                        setSelectedProductId(
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                    >

                      <option value="">
                        {t.selectProduct}
                      </option>

                      {products.map(
                        (product) => (

                          <option
                            key={product.id}
                            value={product.id}
                          >
                            {product.name} ({product.stock} left)
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div>

                    <label className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      {t.quantity}
                    </label>

                    <input
                      type="number"
                      placeholder={t.enterQuantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
                    />

                  </div>

                  {/* TOTALS */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-[2rem] p-6">

                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {t.totalAmount}
                      </p>

                      <h2 className="text-4xl font-black text-blue-700 dark:text-blue-300 mt-3">

                        TZS {total.toLocaleString()}

                      </h2>

                    </div>

                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-[2rem] p-6">

                      <p className="text-sm text-green-600 dark:text-green-400">
                        {t.totalProfit}
                      </p>

                      <h2 className="text-4xl font-black text-green-700 dark:text-green-300 mt-3">

                        TZS {profit.toLocaleString()}

                      </h2>

                    </div>

                  </div>

                  {/* STOCK */}

                  {
                    selectedProduct && (

                      <div className="rounded-[2rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-6">

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-4">

                            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-2xl">

                              <Package className="w-6 h-6 text-blue-600 dark:text-blue-300" />

                            </div>

                            <div>

                              <h3 className="font-bold text-gray-800 dark:text-white">
                                {t.stockAvailable}
                              </h3>

                              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                                {selectedProduct.stock} items remaining
                              </p>

                            </div>

                          </div>

                          {
                            selectedProduct.stock <= 5 && (

                              <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">

                                {t.lowStock}

                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-3xl py-5 font-bold text-lg hover:scale-[1.01] transition"
                  >
                    {t.recordSale}
                  </button>

                </form>

              </div>

            </div>

          </div>
        )
      }

    </DashboardLayout>
  );
}