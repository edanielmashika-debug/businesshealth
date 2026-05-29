"use client";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Package,
  Settings,
  Menu,
  X,
  Trash2
} from "lucide-react";

import { useState } from "react";
import Link from "next/link";


const links = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Transactions",
    href: "/transactions",
  },
  {
    name: "Debts",
    href: "/debts",
  },
  {
    name: "Inventory",
    href: "/inventory",
  },
  {
    name: "Settings",
    href: "/settings",
  },
  {
    name: "Analytics",
    href: "/analytics",
  },
  {
    name: "Sales",
    href: "/sales",
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b bg-white flex items-center justify-between px-4 z-50">
        <h1 className="font-bold text-xl">
          Biashara
        </h1>

        <button className="text-white" onClick={() => { setOpen((prev) => !prev); }}>
          <Menu className="text-white" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <aside className="bg-white w-64 h-full p-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">
                Biashara
              </h1>

              <button onClick={() => { setOpen(false); }}>
                <X />
              </button>
            </div>

            <nav className="space-y-2">
              {links.map((link) => {
             
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block p-3 rounded-lg hover:bg-gray-100 transition"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>

        
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-8">
          Biashara
        </h1>

        <nav className="space-y-2">
          {links.map((link) => {
          

            return (
                                <Link
                    key={link.name}
                    href={link.href}
                    className="block p-3 rounded-lg hover:bg-gray-100 transition"
                  >
                    {link.name}
                  </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}