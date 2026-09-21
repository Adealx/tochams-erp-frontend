"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Boxes,
  FileWarning,
  PackageSearch,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  getReportSummary,
  ReportSummary,
} from "@/services/reportService";

import ReportCard from "./ReportCard";

export default function ReportSummaryCards() {
  const [summary, setSummary] =
    useState<ReportSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReportSummary();

      setSummary(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Unable to load executive report.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const formatCurrency = (
    value: number | string
  ) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  const formatNumber = (
    value: number | string
  ) => {
    return new Intl.NumberFormat("en-NG").format(
      Number(value)
    );
  };

  const cards = [
    {
      title: "Revenue",
      value: summary?.revenue ?? 0,
      subtitle: "Recorded business revenue",
      currency: true,
      icon: <TrendingUp size={19} />,
    },
    {
      title: "Expenses",
      value: summary?.expenses ?? 0,
      subtitle: "Recorded business expenses",
      currency: true,
      icon: <TrendingDown size={19} />,
    },
    {
      title: "Profit",
      value: summary?.profit ?? 0,
      subtitle: "Revenue less expenses",
      currency: true,
      icon: <Banknote size={19} />,
    },
    {
      title: "Inventory Value",
      value: summary?.inventory_value ?? 0,
      subtitle: "Current inventory valuation",
      currency: true,
      icon: <Boxes size={19} />,
    },
    {
      title: "Outstanding Invoices",
      value: summary?.outstanding_invoices ?? 0,
      subtitle: "Invoices awaiting settlement",
      currency: false,
      icon: <FileWarning size={19} />,
    },
    {
      title: "Pending Procurement",
      value: summary?.pending_procurements ?? 0,
      subtitle: "Open procurement activity",
      currency: false,
      icon: <ShoppingCart size={19} />,
    },
    {
      title: "Low Stock Products",
      value: summary?.low_stock_products ?? 0,
      subtitle: "Products requiring attention",
      currency: false,
      icon: <PackageSearch size={19} />,
    },
  ];

  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
        "
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="mt-0.5 text-red-500"
          />

          <div>
            <h2 className="font-bold text-red-800">
              Report Error
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadSummary}
              className="
                mt-4
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-xs
                font-bold
                text-white
                hover:bg-red-700
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BarChartIcon />
            </div>

            <h2 className="text-lg font-black tracking-tight text-slate-950">
              Executive Summary
            </h2>
          </div>

          {lastUpdated && (
            <p className="mt-1 text-[11px] text-slate-400">
              Updated{" "}
              {lastUpdated.toLocaleString("en-NG")}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={loadSummary}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
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
          {loading ? "Refreshing..." : "Refresh Report"}
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <ReportCard
            key={card.title}
            title={card.title}
            value={
              loading
                ? "—"
                : card.currency
                ? formatCurrency(card.value)
                : formatNumber(card.value)
            }
            subtitle={card.subtitle}
            icon={card.icon}
          />
        ))}
      </div>
    </section>
  );
}

function BarChartIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M10 19V9" />
      <path d="M16 19V3" />
      <path d="M22 19V7" />
    </svg>
  );
}