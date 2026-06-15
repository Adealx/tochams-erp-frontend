"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

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

      } catch (error: any) {

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

    <div className="flex min-h-screen">

      {/* Sidebar */}

      <aside className="w-64 bg-slate-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-2">
          TOCHAMS ARP
        </h1>

        <p className="text-sm text-gray-300 mb-8">

          {username}

          {role && (
            <span>
              {" "}
              (
              {role
                .replace(
                  "_",
                  " "
                )
                .toUpperCase()}
              )
            </span>
          )}

        </p>

        <nav className="space-y-4">

          <a
            href="/dashboard"
            className="block hover:text-blue-400"
          >
            Dashboard
          </a>

          <a
            href="/customers"
            className="block hover:text-blue-400"
          >
            Customers
          </a>

          {(role === "admin" ||
            role === "manager") && (

            <a
              href="/inventory"
              className="block hover:text-blue-400"
            >
              Inventory
            </a>

          )}

          <a
            href="/sales-orders"
            className="block hover:text-blue-400"
          >
            Sales Orders
          </a>

          {(role === "admin" ||
            role === "manager" ||
            role === "sales_head") && (

            <a
              href="/invoices"
              className="block hover:text-blue-400"
            >
              Invoices
            </a>

          )}

          {(role === "admin" ||
            role === "manager" ||
            role === "sales_head" || 
            role === "accountant") && (

            <a
              href="/payments"
              className="block hover:text-blue-400"
            >
              Payments
            </a>

          )}

          {(role === "admin" ||
            role === "manager" ||
            role === "accountant") && (

            <a
              href="/audit-logs"
              className="block hover:text-blue-400"
            >
              Audit Logs
            </a>

          )}

          {role === "admin" && (

            <a
              href="/users"
              className="block hover:text-blue-400"
            >
              Users
            </a>

          )}

          <button
            type="button"
            onClick={logout}
            className="block w-full text-left text-red-400 hover:text-red-600 mt-8"
          >
            Logout
          </button>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="flex-1 bg-gray-100 p-6">

        {children}

      </main>

    </div>
  );
}