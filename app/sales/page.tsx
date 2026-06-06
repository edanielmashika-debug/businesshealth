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

import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  CalendarDays,
  Plus,
  X,
} from "lucide-react";

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

  const [showForm, setShowForm] =
    useState(false);

  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Sales
            </h1>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Record and track your business sales
            </p>

          </div>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
          >

            <Plus size={26} />

          </button>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-80">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <DollarSign />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-80">
                  Total Profit
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {totalProfit.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <TrendingUp />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-violet-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-80">
                  Sales Count
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {sales.length}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <ShoppingCart />
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}

        {/* FORM POPUP */}

        {
          showForm && (

            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

              <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">

                {/* CLOSE BUTTON */}

                <button
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="absolute top-5 right-5 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
                >

                  <X size={22} />

                </button>

                <div className="mb-6">

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Record Sale
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Create and track product sales
                  </p>

                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  <div>

                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Product
                    </span>

                    <select
                      value={selectedProductId}
                      onChange={(e) =>
                        setSelectedProductId(
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition text-black dark:text-white"
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
                            {product.name} ({product.stock} left)
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div>

                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Quantity
                    </span>

                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition text-black dark:text-white placeholder:text-gray-400"
                    />

                  </div>

                  {/* TOTAL */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-3xl p-6">

                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Total Amount
                      </p>

                      <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                        TZS {total.toLocaleString()}
                      </h2>

                    </div>

                    <div className="bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 rounded-3xl p-6">

                      <p className="text-sm text-green-600 dark:text-green-400">
                        Total Profit
                      </p>

                      <h2 className="text-4xl font-bold text-green-700 dark:text-green-300 mt-2">
                        TZS {profit.toLocaleString()}
                      </h2>

                    </div>

                  </div>

                  {/* STOCK STATUS */}

                  {
                    selectedProduct && (

                      <div className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-5">

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-2xl">

                              <Package className="w-5 h-5 text-blue-600 dark:text-blue-300" />

                            </div>

                            <div>

                              <h3 className="font-semibold text-gray-800 dark:text-white">
                                Stock Available
                              </h3>

                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                {selectedProduct.stock} items remaining
                              </p>

                            </div>

                          </div>

                          {
                            selectedProduct.stock <= 5 && (

                              <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
                                Low Stock
                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }

                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold hover:scale-[1.01] transition"
                  >
                    Record Sale
                  </button>

                </form>

              </div>

            </div>
          )
        }

        {/* SALES LIST */}

        <div className="space-y-4">

          {sales.map((sale) => (

            <div
              key={sale.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-md transition"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {sale.productName}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Product Sale
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Revenue
                  </p>

                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    TZS{" "}
                    {sale.total.toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Quantity
                  </p>

                  <h3 className="text-xl font-bold mt-1 text-black dark:text-white">
                    {sale.quantity}
                  </h3>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Profit
                  </p>

                  <h3 className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
                    TZS{" "}
                    {sale.profit.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">

                  <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Date
                  </p>

                  <h3 className="text-sm font-semibold mt-1 text-black dark:text-white">
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