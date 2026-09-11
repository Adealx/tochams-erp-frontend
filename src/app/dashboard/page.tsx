"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getDashboardData } from "@/services/dashboardService";

import AppShell from "@/components/layout/AppShell";

import DashboardSection from "@/components/dashboard/DashboardSection";
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
    console.log("TOCHAMS ERP Dashboard Mounted");
    console.log("Authenticated User:", user);
    console.log("================================");

    loadDashboard();
  }, [user, authLoading]);

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  async function loadDashboard() {
    try {
      console.log("Loading TOCHAMS ERP dashboard...");

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
        "TOCHAMS ERP Dashboard Error:",
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
            min-h-[520px]
            items-center
            justify-center
            rounded-[22px]
            border
            border-slate-200
            bg-white
            shadow-[0_8px_30px_rgba(15,23,42,0.045)]
          "
        >
          <div className="flex flex-col items-center">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
              "
            >
              <div
                className="
                  h-6
                  w-6
                  animate-spin
                  rounded-full
                  border-2
                  border-blue-200
                  border-t-blue-600
                "
              />
            </div>

            <p
              className="
                mt-4
                text-sm
                font-bold
                text-slate-800
              "
            >
              Loading Dashboard
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Preparing your enterprise overview...
            </p>

          </div>
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

      <div className="space-y-7">

        {/* =================================================
            EXECUTIVE INTRO
        ================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-blue-100
            bg-gradient-to-r
            from-[#08245F]
            via-[#0D3FAF]
            to-[#155EEF]
            px-6
            py-6
            text-white
            shadow-[0_12px_35px_rgba(15,23,42,0.10)]
            sm:px-7
          "
        >

          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-28
              h-64
              w-64
              rounded-full
              bg-cyan-300/15
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              left-1/3
              h-52
              w-52
              rounded-full
              bg-blue-300/10
              blur-3xl
            "
          />

          {/* Content */}

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-cyan-200
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-cyan-300
                  "
                />

                TOCHAMS ERP

                <span className="text-blue-200">
                  •
                </span>

                Executive Command Center

              </div>

              <h1
                className="
                  text-2xl
                  font-black
                  tracking-[-0.035em]
                  sm:text-3xl
                "
              >
                Business Overview
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-blue-100
                "
              >
                Monitor financial performance, sales,
                inventory, customers and operational
                activity from one central control center.
              </p>

            </div>

            {/* System status */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-white/15
                bg-white/10
                px-4
                py-2
                backdrop-blur-md
              "
            >

              <span className="relative flex h-2 w-2">

                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-emerald-300
                    opacity-60
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-400
                  "
                />

              </span>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                "
              >
                ERP Services Operational
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            FINANCIAL OVERVIEW
        ================================================== */}

        <DashboardSection
          title="Financial Overview"
          description="Current accounting performance and customer receivables"
          accent="blue"
        >

          <FinancialOverview
            stats={{
              revenue: stats.revenue,
              expenses: stats.expenses,
              netProfit: stats.netProfit,
              outstanding: stats.outstanding,
            }}
          />

        </DashboardSection>


        {/* =================================================
            OPERATIONS OVERVIEW
        ================================================== */}

        <DashboardSection
          title="Operations Overview"
          description="Live operational performance across the enterprise"
          accent="cyan"
        >

          <StatsGrid
            stats={stats}
          />

        </DashboardSection>


        {/* =================================================
            BUSINESS ANALYTICS
        ================================================== */}

        <DashboardSection
          title="Business Analytics"
          description="Sales, invoice and order fulfillment insights"
          accent="violet"
        >

          <div
            className="
              grid
              grid-cols-1
              gap-5
              xl:grid-cols-2
            "
          >

            <InvoiceStatusChart
              data={invoiceChart}
            />

            <OrdersOverviewChart
              totalOrders={stats.orders}
              pendingOrders={stats.pendingOrders}
            />

          </div>

        </DashboardSection>


        {/* =================================================
            INVENTORY ALERTS
            -------------------------------------------------
            IMPORTANT:
            This is intentionally NOT wrapped inside
            DashboardSection.

            LowStockCard owns its own:
            - header
            - collapse / expand state
            - alert count
            - inventory list
            - empty state
        ================================================== */}

        <LowStockCard
          products={lowStock}
        />


        {/* =================================================
            RECENT ACTIVITY
        ================================================== */}

        <DashboardSection
          title="Recent Activity"
          description="Latest sales and customer activity across TOCHAMS ERP"
          accent="emerald"
        >

          <div
            className="
              grid
              grid-cols-1
              gap-5
              xl:grid-cols-2
            "
          >

            <RecentOrders
              orders={orders}
            />

            <RecentCustomers
              customers={customers}
            />

          </div>

        </DashboardSection>

      </div>

    </AppShell>
  );
}