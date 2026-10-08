"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  getDashboardData,
} from "@/services/dashboardService";

import AppShell from "@/components/layout/AppShell";

import FinancialOverview from "@/components/dashboard/FinancialOverview";

import StatsGrid from "@/components/dashboard/StatsGrid";

import InvoiceStatusChart from "@/components/dashboard/InvoiceStatusChart";

import OrdersOverviewChart from "@/components/dashboard/OrdersOverviewChart";

import LowStockCard from "@/components/dashboard/LowStockCard";

import RecentOrders from "@/components/dashboard/RecentOrders";

import RecentCustomers from "@/components/dashboard/RecentCustomers";

import ManagementAttention from "@/components/dashboard/ManagementAttention";


export const dynamic = "force-dynamic";


type FinancialScope =
  | "company"
  | "sales_rep";


type FinancialRole =
  | "management"
  | "sales_rep";


interface DashboardStats {

  customers: number;

  products: number;

  orders: number;

  invoices: number;

  payments: number;

  outstanding: number;


  pendingOrders: number;

  lowStock: number;


  storeValue: number;

  potentialSalesValue: number;

  potentialProfit: number;


  revenue: number;

  paid: number;

  cogs: number;

  grossProfit: number;

  expenses: number;

  netProfit: number;


  financialScope:
    FinancialScope;

  financialRole:
    FinancialRole;
}


export default function Dashboard() {

  const {
    user,
    loading: authLoading,
  } = useAuth();


  // =========================================================
  // DASHBOARD STATS
  // =========================================================

  const [
    stats,
    setStats,
  ] = useState<DashboardStats>({

    customers: 0,

    products: 0,

    orders: 0,

    invoices: 0,

    payments: 0,

    outstanding: 0,


    pendingOrders: 0,

    lowStock: 0,


    storeValue: 0,

    potentialSalesValue: 0,

    potentialProfit: 0,


    revenue: 0,

    paid: 0,

    cogs: 0,

    grossProfit: 0,

    expenses: 0,

    netProfit: 0,


    financialScope:
      "company",

    financialRole:
      "management",
  });


  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  const [
    invoiceChart,
    setInvoiceChart,
  ] = useState<any[]>([]);


  const [
    lowStock,
    setLowStock,
  ] = useState<any[]>([]);


  const [
    orders,
    setOrders,
  ] = useState<any[]>([]);


  const [
    customers,
    setCustomers,
  ] = useState<any[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {

    if (authLoading) {
      return;
    }


    if (!user) {

      setLoading(false);

      return;
    }


    loadDashboard();

  }, [
    user,
    authLoading,
  ]);


  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  async function loadDashboard(
    showRefreshState = false
  ) {

    try {

      if (showRefreshState) {
        setRefreshing(true);
      }


      const dashboard =
        await getDashboardData();


      setStats(
        dashboard.stats
      );


      setInvoiceChart(
        dashboard.invoiceChart
      );


      setLowStock(
        dashboard.lowStock
      );


      setOrders(
        dashboard.orders
      );


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

      setRefreshing(false);

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
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_8px_30px_rgba(15,23,42,0.035)]
          "
        >

          <div className="text-center">

            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >

              <Activity
                size={22}
                className="animate-pulse"
              />

            </div>


            <p
              className="
                mt-4
                text-sm
                font-bold
                text-slate-900
              "
            >
              Loading dashboard
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
  // ROLE-AWARE FINANCIAL DISPLAY
  // =========================================================

  const isSalesRep =
    stats.financialRole ===
    "sales_rep";


  const financialHeading =
    isSalesRep
      ? "My Financial Performance"
      : "Financial Overview";


  const financialDescription =
    isSalesRep

      ? "Your sales revenue, customer payments, outstanding balances and customer portfolio"

      : "Company-wide accounting performance and customer receivables";


  const heroHeading =
    isSalesRep
      ? "My Sales Command Center"
      : "Business Overview";


  const heroDescription =
    isSalesRep

      ? "Track your sales performance, customers, orders, payments and outstanding balances from one central control center."

      : "Monitor financial performance, sales, inventory, customers and operational activity from one central control center.";


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (

    <AppShell
      title="Dashboard"
      subtitle="Enterprise Resource Planning Overview"
    >

      <div className="space-y-7">


        {/* =====================================================
            EXECUTIVE HERO
        ====================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-blue-200/60
            bg-gradient-to-br
            from-[#071A46]
            via-[#0B328F]
            to-[#155EEF]
            px-6
            py-7
            text-white
            shadow-[0_18px_45px_rgba(15,23,42,0.12)]
            sm:px-8
            sm:py-8
          "
        >

          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-32
              h-80
              w-80
              rounded-full
              bg-cyan-300/10
              blur-3xl
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              left-1/3
              h-72
              w-72
              rounded-full
              bg-blue-300/10
              blur-3xl
            "
          />


          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-7
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            {/* Main message */}

            <div className="max-w-3xl">

              <div
                className="
                  mb-3
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
                  /
                </span>

                {isSalesRep
                  ? "Sales Command Center"
                  : "Executive Command Center"}

              </div>


              <div className="flex items-center gap-3">

                <h1
                  className="
                    text-2xl
                    font-black
                    tracking-[-0.04em]
                    sm:text-3xl
                  "
                >
                  {heroHeading}
                </h1>


                <Sparkles
                  size={20}
                  className="
                    hidden
                    text-cyan-200
                    sm:block
                  "
                />

              </div>


              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-blue-100
                "
              >
                {heroDescription}
              </p>

            </div>


            {/* Right side controls */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              {/* Date */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-2.5
                  backdrop-blur-md
                "
              >

                <CalendarDays
                  size={14}
                  className="text-blue-200"
                />


                <span
                  className="
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  {new Date().toLocaleDateString(
                    "en-NG",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>

              </div>


              {/* Refresh */}

              <button
                type="button"
                onClick={() =>
                  loadDashboard(true)
                }
                disabled={refreshing}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  backdrop-blur-md
                  transition
                  hover:bg-white/15
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <RefreshCw
                  size={14}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

            </div>

          </div>


          {/* System status */}

          <div
            className="
              relative
              z-10
              mt-7
              flex
              flex-wrap
              items-center
              gap-4
              border-t
              border-white/10
              pt-5
            "
          >

            <div className="flex items-center gap-2">

              <span
                className="
                  relative
                  flex
                  h-2.5
                  w-2.5
                "
              >

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
                    h-2.5
                    w-2.5
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


            <div
              className="
                hidden
                h-4
                w-px
                bg-white/15
                sm:block
              "
            />


            <div
              className="
                flex
                items-center
                gap-2
                text-[10px]
                text-blue-100
              "
            >

              <ShieldCheck size={13} />

              {isSalesRep
                ? "Personal sales workspace active"
                : "Enterprise control center active"}

            </div>

          </div>

        </section>


        {/* =====================================================
            FINANCIAL PERFORMANCE
        ====================================================== */}

        <section>

          <div
            className="
              mb-4
              flex
              items-end
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-blue-600
                "
              >
                {isSalesRep
                  ? "My Financial Performance"
                  : "Financial Performance"}
              </p>


              <h2
                className="
                  mt-1
                  text-lg
                  font-black
                  tracking-[-0.025em]
                  text-slate-950
                "
              >
                {financialHeading}
              </h2>


              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                {financialDescription}
              </p>

            </div>


            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-1.5
                text-[10px]
                font-semibold
                text-slate-500
                shadow-sm
                sm:flex
              "
            >

              <Activity size={12} />

              Live data

            </div>

          </div>


          <FinancialOverview
            stats={{

              revenue:
                stats.revenue,

              paid:
                stats.paid,

              cogs:
                stats.cogs,

              grossProfit:
                stats.grossProfit,

              expenses:
                stats.expenses,

              netProfit:
                stats.netProfit,

              outstanding:
                stats.outstanding,

              customers:
                stats.customers,

              financialScope:
                stats.financialScope,

              financialRole:
                stats.financialRole,

            }}
          />

        </section>


        {/* =====================================================
            OPERATIONS
        ====================================================== */}

        <section>

          <div className="mb-4">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-cyan-600
              "
            >
              Operations
            </p>


            <h2
              className="
                mt-1
                text-lg
                font-black
                tracking-[-0.025em]
                text-slate-950
              "
            >
              {isSalesRep
                ? "My Operational Snapshot"
                : "Operational Snapshot"}
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              {isSalesRep
                ? "Your current sales and operational activity"
                : "Live operational performance across the enterprise"}
            </p>

          </div>


          <StatsGrid
            stats={stats}
          />

        </section>


        {/* =====================================================
            ANALYTICS
        ====================================================== */}

        <section>

          <div className="mb-4">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-violet-600
              "
            >
              Intelligence
            </p>


            <h2
              className="
                mt-1
                text-lg
                font-black
                tracking-[-0.025em]
                text-slate-950
              "
            >
              Business Analytics
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Invoice distribution and order fulfillment performance
            </p>

          </div>


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

        </section>


        {/* =====================================================
            INVENTORY ALERTS
        ====================================================== */}

        <section>

          <div className="mb-4">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-amber-600
              "
            >
              Inventory Control
            </p>


            <h2
              className="
                mt-1
                text-lg
                font-black
                tracking-[-0.025em]
                text-slate-950
              "
            >
              Inventory Health
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Products requiring attention or replenishment
            </p>

          </div>


          <LowStockCard
            products={lowStock}
          />

        </section>


        {/* =====================================================
            MANAGEMENT ATTENTION
        ====================================================== */}

        <section>

          <div className="mb-4">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-red-600
              "
            >
              Control Center
            </p>


            <h2
              className="
                mt-1
                text-lg
                font-black
                tracking-[-0.025em]
                text-slate-950
              "
            >
              Management Attention
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Issues, exceptions and pending actions requiring management review
            </p>

          </div>


          <ManagementAttention
            overdueInvoices={0}
            outstandingAmount={
              stats.outstanding
            }
            lowStock={
              stats.lowStock
            }
            pendingOrders={
              stats.pendingOrders
            }
            pendingPayments={0}
            pendingProcurement={0}
          />

        </section>


        {/* =====================================================
            RECENT ACTIVITY
        ====================================================== */}

        <section>

          <div
            className="
              mb-4
              flex
              items-end
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-emerald-600
                "
              >
                Activity
              </p>


              <h2
                className="
                  mt-1
                  text-lg
                  font-black
                  tracking-[-0.025em]
                  text-slate-950
                "
              >
                Recent Activity
              </h2>


              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                {isSalesRep
                  ? "Your latest sales and customer activity"
                  : "Latest sales and customer activity across TOCHAMS ERP"}
              </p>

            </div>


            <ArrowUpRight
              size={18}
              className="
                hidden
                text-slate-300
                sm:block
              "
            />

          </div>


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

        </section>

      </div>

    </AppShell>
  );
}