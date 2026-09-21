"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Package,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Trophy,
  Warehouse,
} from "lucide-react";

import ReportCard from "../ReportCard";

import {
  getInventoryReport,
} from "@/services/reportService";

import type {
  InventoryReportData,
} from "@/services/reportService";

export default function InventoryReport() {
  const [report, setReport] =
    useState<InventoryReportData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadReport(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getInventoryReport();

      setReport(data);
    } catch (err) {
      console.error(
        "Failed to load inventory report:",
        err
      );

      setError(
        "Unable to load inventory report. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-7 w-52 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
        </div>

        {/* KPI skeletons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-5
                shadow-[0_4px_18px_rgba(15,23,42,0.035)]
              "
            >
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-7 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading analytics */}
        <div
          className="
            flex
            min-h-[220px]
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200/80
            bg-white
            shadow-[0_4px_18px_rgba(15,23,42,0.035)]
          "
        >
          <div className="text-center">
            <Warehouse
              size={32}
              className="mx-auto animate-pulse text-blue-500"
            />

            <p className="mt-3 text-sm font-semibold text-slate-500">
              Loading Inventory Report...
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Fetching current inventory statistics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error || !report) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
          shadow-sm
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-100
              text-red-600
            "
          >
            <AlertTriangle size={19} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-black text-red-900">
              Inventory Report Unavailable
            </h2>

            <p className="mt-1 text-xs leading-5 text-red-700">
              {error ||
                "We could not retrieve the inventory report."}
            </p>

            <button
              type="button"
              onClick={() => loadReport(true)}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-xs
                font-bold
                text-white
                transition
                hover:bg-red-700
              "
            >
              <RefreshCw size={13} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inventoryValue = new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }
  ).format(Number(report.inventory_value));

  return (
    <section className="space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">
            Inventory Intelligence
          </p>

          <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950 sm:text-xl">
            Inventory Report
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
            Real-time inventory performance, stock levels,
            valuation and warehouse activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReport(true)}
          disabled={refreshing}
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-xs
            font-bold
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={14}
            className={
              refreshing
                ? "animate-spin"
                : undefined
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Report"}
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard
          title="Total Products"
          value={report.total_products}
          subtitle="Registered products"
          icon={<Package size={19} />}
        />

        <ReportCard
          title="Inventory Value"
          value={inventoryValue}
          subtitle="Current inventory valuation"
          icon={<DollarSign size={19} />}
        />

        <ReportCard
          title="Low Stock"
          value={report.low_stock_items}
          subtitle="Below reorder level"
          icon={<AlertTriangle size={19} />}
        />

        <ReportCard
          title="Out of Stock"
          value={report.out_of_stock}
          subtitle="Requires immediate restocking"
          icon={<Boxes size={19} />}
        />

        <ReportCard
          title="Stock In"
          value={report.stock_in}
          subtitle="Incoming inventory movement"
          icon={<TrendingUp size={19} />}
        />

        <ReportCard
          title="Stock Out"
          value={report.stock_out}
          subtitle="Outgoing inventory movement"
          icon={<TrendingDown size={19} />}
        />

        <ReportCard
          title="Average Stock"
          value={Number(report.average_stock).toFixed(2)}
          subtitle="Average quantity per product"
          icon={<Warehouse size={19} />}
        />

        <ReportCard
          title="Highest Value Product"
          value={
            report.highest_value_product?.name ?? "-"
          }
          subtitle={
            report.highest_value_product
              ? `SKU: ${report.highest_value_product.sku} • Qty: ${report.highest_value_product.quantity}`
              : "No inventory available"
          }
          icon={<Trophy size={19} />}
        />
      </div>

      {/* =====================================================
          INVENTORY ANALYTICS
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200/80
          bg-white
          shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-slate-100
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <div>
            <h3 className="text-sm font-black text-slate-950">
              Inventory Analytics
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Inventory value and stock movement analysis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp size={15} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Data
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {/* Inventory value */}
          <AnalyticsPlaceholder
            icon={<DollarSign size={18} />}
            title="Inventory Value by Category"
            description="Visual breakdown of current inventory valuation across product categories."
          />

          {/* Stock movement */}
          <AnalyticsPlaceholder
            icon={<TrendingUp size={18} />}
            title="Stock Movement"
            description="Visual analysis of incoming and outgoing inventory movements."
          />
        </div>
      </section>

      {/* =====================================================
          INVENTORY TABLES
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200/80
          bg-white
          shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-slate-100
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <div>
            <h3 className="text-sm font-black text-slate-950">
              Inventory Details
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Operational inventory information requiring attention.
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Package size={15} />
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
          <TablePlaceholder
            title="Low Stock Products"
            description="Products below their configured reorder level."
            icon={<AlertTriangle size={18} />}
          />

          <TablePlaceholder
            title="Top Inventory Products"
            description="Products contributing the highest inventory value."
            icon={<Trophy size={18} />}
          />

          <TablePlaceholder
            title="Recently Restocked"
            description="Products with recent incoming stock activity."
            icon={<Boxes size={18} />}
          />
        </div>
      </section>
    </section>
  );
}

/* ============================================================
   ANALYTICS PLACEHOLDER
============================================================ */

function AnalyticsPlaceholder({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        min-h-[170px]
        rounded-xl
        border
        border-dashed
        border-slate-200
        bg-slate-50/70
        p-5
      "
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <h4 className="mt-4 text-xs font-bold text-slate-700">
        {title}
      </h4>

      <p className="mt-1 max-w-md text-[11px] leading-5 text-slate-400">
        {description}
      </p>

      <div className="mt-5 flex items-end gap-1">
        <span className="h-4 w-1.5 rounded-full bg-slate-200" />
        <span className="h-7 w-1.5 rounded-full bg-slate-200" />
        <span className="h-5 w-1.5 rounded-full bg-slate-200" />
        <span className="h-10 w-1.5 rounded-full bg-slate-300" />
        <span className="h-8 w-1.5 rounded-full bg-slate-200" />
        <span className="h-12 w-1.5 rounded-full bg-slate-300" />
        <span className="h-6 w-1.5 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

/* ============================================================
   TABLE PLACEHOLDER
============================================================ */

function TablePlaceholder({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50/70
        p-5
        transition
        hover:border-slate-300
        hover:bg-slate-50
      "
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <h4 className="mt-4 text-xs font-bold text-slate-700">
        {title}
      </h4>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {description}
      </p>

      <div className="mt-5 space-y-2">
        <div className="h-2 rounded-full bg-slate-200" />
        <div className="h-2 w-4/5 rounded-full bg-slate-200" />
        <div className="h-2 w-3/5 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}