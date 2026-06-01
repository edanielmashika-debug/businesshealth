"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/dashboard-layout";

import {
  useInventoryStore,
} from "@/store/inventory-store";

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
      id: crypto.randomUUID(),

      name,

      stock: Number(stock),

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

  return (
    <DashboardLayout>
      
      <div className="space-y-8">
        
        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your products
          </p>
        </div>

        {/* FORM */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Product
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add new inventory
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold shadow-lg"
            >
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
                  className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition"
                >
                  
                  <div className="flex items-start justify-between">
                    
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {
                          product.name
                        }
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Inventory Product
                      </p>
                    </div>

                    {isLowStock && (
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Low Stock
                      </div>
                    )}
                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500">
                        Stock Left
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        {
                          product.stock
                        }
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500">
                        Profit
                      </p>

                      <h3 className="text-xl font-bold mt-1 text-green-600">
                        TZS{" "}
                        {profit.toLocaleString()}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500">
                        Buying Price
                      </p>

                      <h3 className="text-lg font-bold mt-1">
                        TZS{" "}
                        {product.buyPrice.toLocaleString()}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500">
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
                    className="mt-6 w-full bg-red-50 text-red-600 rounded-2xl py-3 font-semibold hover:bg-red-100 transition"
                  >
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