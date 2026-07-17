"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getReportSummary,
  ReportSummary,
} from "@/services/reportService";

export default function ReportSummaryCards() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReportSummary();

      setSummary(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  const formatNumber = (value: number | string) => {
    return new Intl.NumberFormat("en-NG").format(Number(value));
  };

  const cards = [
    {
      title: "Revenue",
      value: summary?.revenue ?? 0,
      currency: true,
    },
    {
      title: "Expenses",
      value: summary?.expenses ?? 0,
      currency: true,
    },
    {
      title: "Profit",
      value: summary?.profit ?? 0,
      currency: true,
    },
    {
      title: "Inventory Value",
      value: summary?.inventory_value ?? 0,
      currency: true,
    },
    {
      title: "Outstanding Invoices",
      value: summary?.outstanding_invoices ?? 0,
      currency: false,
    },
    {
      title: "Pending Procurement",
      value: summary?.pending_procurements ?? 0,
      currency: false,
    },
    {
      title: "Low Stock Products",
      value: summary?.low_stock_products ?? 0,
      currency: false,
    },
  ];

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Report Error
        </h2>

        <p className="mt-2 text-red-600">
          {error}
        </p>

        <button
          onClick={loadSummary}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Executive Summary
          </h2>

          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last Updated:{" "}
              {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        <button
          onClick={loadSummary}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
        >
          Refresh
        </button>

      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.title}
            className="rounded-xl bg-white p-5 shadow transition hover:shadow-lg"
          >

            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">

              {loading
                ? "--"
                : card.currency
                ? formatCurrency(card.value)
                : formatNumber(card.value)}

            </h2>

          </div>

        ))}

      </div>

    </div>
  );
}