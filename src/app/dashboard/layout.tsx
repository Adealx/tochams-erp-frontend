"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  Wallet,
  Shield,
  Truck,
  ClipboardList,
  LogOut,
} from "lucide-react";

import {
  hasPermission,
} from "@/lib/permissions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] =
    useState("");

  const [username, setUsername] =
    useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response =
          await api.get(
            "/accounts/me/"
          );

        setRole(
          response.data.role
        );

        setUsername(
          response.data.username
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data
          )
        );
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 text-white flex flex-col">

        <div className="p-6 border-b border-slate-800">

          <h1 className="text-2xl font-bold">
            TOCHAMS ARP
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            {username}
          </p>

          <p className="text-xs text-blue-400">

            {role
              ?.replace(
                "_",
                " "
              )
              ?.toUpperCase()}

          </p>

        </div>

        <nav className="flex-1 p-4 space-y-2">

          <a
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a
            href="/customers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <Users size={20} />
            Customers
          </a>

          {hasPermission(role, "vendors") && (
            <a
              href="/vendors"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Truck size={20} />
              Vendors
            </a>
          )}

          {hasPermission(
            role,
            "inventory"
          ) && (
            <a
              href="/inventory"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Package size={20} />
              Inventory
            </a>
          )}
           
          {hasPermission(role, "procurement") && (
            <a
              href="/procurement"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <ClipboardList size={20} />
              Procurement
            </a>
          )}

          <a
            href="/sales-orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <ShoppingCart size={20} />
            Sales Orders
          </a>

          {hasPermission(
            role,
            "invoices"
          ) && (
            <a
              href="/invoices"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Receipt size={20} />
              Invoices
            </a>
          )}

          {hasPermission(
            role,
            "payments"
          ) && (
            <a
              href="/payments"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Wallet size={20} />
              Payments
            </a>
          )}

          {hasPermission(
            role,
            "users"
          ) && (
            <a
              href="/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Shield size={20} />
              Users
            </a>
          )}

        </nav>

        <div className="p-4 border-t border-slate-800">

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}

      <main className="flex-1 p-8 overflow-auto">

        {children}

      </main>

    </div>
  );
}