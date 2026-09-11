"use client";

import StatCard from "@/components/cards/StatCard";

import {
  TrendingUp,
  TrendingDown,
  BadgeDollarSign,
  CircleDollarSign,
} from "lucide-react";

interface FinancialOverviewProps {
  stats: {
    revenue: number;
    expenses: number;
    netProfit: number;
    outstanding: number;
  };
}

function formatCurrency(value: number) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

export default function FinancialOverview({
  stats,
}: FinancialOverviewProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {/* =====================================================
          REVENUE
      ====================================================== */}

      <StatCard
        title="Revenue"
        value={formatCurrency(stats.revenue)}
        icon={<TrendingUp size={21} />}
        color="green"
        description="Posted sales revenue"
      />

      {/* =====================================================
          EXPENSES
      ====================================================== */}

      <StatCard
        title="Expenses"
        value={formatCurrency(stats.expenses)}
        icon={<TrendingDown size={21} />}
        color="red"
        description="Posted and reversed accounting activity"
      />

      {/* =====================================================
          NET PROFIT
      ====================================================== */}

      <StatCard
        title="Net Profit"
        value={formatCurrency(stats.netProfit)}
        icon={<BadgeDollarSign size={21} />}
        color="amber"
        description="Revenue less expenses"
      />

      {/* =====================================================
          OUTSTANDING
      ====================================================== */}

      <StatCard
        title="Outstanding"
        value={formatCurrency(stats.outstanding)}
        icon={<CircleDollarSign size={21} />}
        color="red"
        description="Customer receivable balances"
      />
    </div>
  );
}