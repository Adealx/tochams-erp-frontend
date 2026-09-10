"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";

import { getDashboardData } from "@/services/dashboardService";

import AppShell from "@/components/layout/AppShell";

import FinancialOverview from "@/components/dashboard/FinancialOverview";
import StatsGrid from "@/components/dashboard/StatsGrid";
import InvoiceStatusChart from "@/components/dashboard/InvoiceStatusChart";
import OrdersOverviewChart from "@/components/dashboard/OrdersOverviewChart";
import LowStockCard from "@/components/dashboard/LowStockCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RecentCustomers from "@/components/dashboard/RecentCustomers";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  // =========================================================
  // DASHBOARD STATS
  // =========================================================

  const [stats, setStats] = useState({
    // Operational metrics
    customers: 0,
    products: 0,
    orders: 0,
    invoices: 0,
    payments: 0,
    outstanding: 0,
    pendingOrders: 0,
    lowStock: 0,

    // Inventory / projection metrics
    storeValue: 0,
    potentialSalesValue: 0,
    potentialProfit: 0,

    // Accounting / financial metrics
    revenue: 0,
    expenses: 0,
    netProfit: 0,
  });

  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  const [invoiceChart, setInvoiceChart] =
    useState<any[]>([]);

  const [lowStock, setLowStock] =
    useState<any[]>([]);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [customers, setCustomers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // LOAD DASHBOARD AFTER AUTHENTICATION
  // =========================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    console.log("================================");
    console.log("Dashboard Mounted");
    console.log("Authenticated User:", user);
    console.log("================================");

    loadDashboard();
  }, [user, authLoading]);

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  async function loadDashboard() {
    try {
      console.log("Loading dashboard...");
      console.log("Current User:", user);

      const dashboard =
        await getDashboardData();

      console.log(
        "Dashboard Data:",
        dashboard
      );

      // -----------------------------------------------------
      // FINANCIAL + OPERATIONAL STATS
      // -----------------------------------------------------

      setStats(dashboard.stats);

      // -----------------------------------------------------
      // INVOICE CHART
      // -----------------------------------------------------

      setInvoiceChart(
        dashboard.invoiceChart
      );

      // -----------------------------------------------------
      // LOW STOCK
      // -----------------------------------------------------

      setLowStock(
        dashboard.lowStock
      );

      // -----------------------------------------------------
      // RECENT ORDERS
      // -----------------------------------------------------

      setOrders(
        dashboard.orders
      );

      // -----------------------------------------------------
      // RECENT CUSTOMERS
      // -----------------------------------------------------

      setCustomers(
        dashboard.customers
      );

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <AppShell
        title="Dashboard"
        subtitle="Enterprise Resource Planning Overview"
      >
        <div
          className="
            flex
            h-[500px]
            items-center
            justify-center
            rounded-3xl
            border
            border-slate-200
            bg-white
          "
        >
          <p
            className="
              text-lg
              font-medium
              text-slate-500
            "
          >
            Loading Dashboard...
          </p>
        </div>
      </AppShell>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <AppShell
      title="Dashboard"
      subtitle="Enterprise Resource Planning Overview"
    >

      {/* ===================================================
          FINANCIAL OVERVIEW
          =================================================== */}

      <FinancialOverview
        stats={{
          revenue: stats.revenue,
          expenses: stats.expenses,
          netProfit: stats.netProfit,
          outstanding: stats.outstanding,
        }}
      />

      {/* ===================================================
          OPERATIONAL KPIs
          =================================================== */}

      <StatsGrid
        stats={stats}
      />

      {/* ===================================================
          BUSINESS ANALYTICS
          =================================================== */}

      <section className="space-y-5">

        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Business Analytics
          </h2>

          <p className="text-slate-500">
            Sales and invoice insights
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
            items-stretch
          "
        >

          <InvoiceStatusChart
            data={invoiceChart}
          />

          <OrdersOverviewChart
            totalOrders={stats.orders}
            pendingOrders={
              stats.pendingOrders
            }
          />

        </div>

      </section>

      {/* ===================================================
          INVENTORY ALERTS
          =================================================== */}

      <section className="space-y-5">

        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Inventory Alerts
          </h2>

          <p className="text-slate-500">
            Products requiring attention
          </p>
        </div>

        <LowStockCard
          products={lowStock}
        />

      </section>

      {/* ===================================================
          RECENT ACTIVITY
          =================================================== */}

      <section className="space-y-5">

        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Recent Activity
          </h2>

          <p className="text-slate-500">
            Latest sales and customer updates
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
            items-stretch
          "
        >

          <RecentOrders
            orders={orders}
          />

          <RecentCustomers
            customers={customers}
          />

        </div>

      </section>

    </AppShell>
  );
}