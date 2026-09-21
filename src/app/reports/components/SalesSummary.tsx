"use client";

import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  FileCheck2,
  FileClock,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import {
  getSalesReport,
  SalesReport,
} from "@/services/reportService";

import ReportCard from "./ReportCard";

export default function SalesSummary() {
  const [report, setReport] =
    useState<SalesReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await getSalesReport();
        setReport(data);
      } catch {
        setError("Failed to load Sales Report");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const money = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Loading Sales Report...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!report) return null;

  const cards = [
    {
      title: "Total Sales",
      value: money(report.total_sales),
      subtitle: "Recorded sales value",
      icon: <CircleDollarSign size={19} />,
    },
    {
      title: "Orders",
      value: report.total_orders,
      subtitle: "Total sales orders",
      icon: <ShoppingCart size={19} />,
    },
    {
      title: "Average Sale",
      value: money(report.average_sale),
      subtitle: "Average order value",
      icon: <TrendingUp size={19} />,
    },
    {
      title: "Paid Invoices",
      value: report.paid_invoices,
      subtitle: "Fully settled invoices",
      icon: <FileCheck2 size={19} />,
    },
    {
      title: "Pending Invoices",
      value: report.pending_invoices,
      subtitle: "Awaiting payment",
      icon: <FileClock size={19} />,
    },
    {
      title: "Outstanding Amount",
      value: money(report.outstanding_amount),
      subtitle: "Receivable balance",
      icon: <CircleDollarSign size={19} />,
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">
          Sales Intelligence
        </p>

        <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
          Sales Report
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Revenue, order and invoice performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <ReportCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
          />
        ))}
      </div>
    </section>
  );
}