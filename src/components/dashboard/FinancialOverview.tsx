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

export default function FinancialOverview({
  stats,
}: FinancialOverviewProps) {
  return (
    <section className="space-y-5">

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Financial Overview
        </h2>

        <p className="text-sm text-slate-500">
          Current accounting performance and receivables
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-7
        "
      >

        {/* Revenue */}

        <StatCard
          title="Revenue"
          value={`₦${stats.revenue.toLocaleString()}`}
          icon={<TrendingUp size={22} />}
          color="green"
          description="Posted sales revenue"
        />

        {/* Expenses */}

        <StatCard
          title="Expenses"
          value={`₦${stats.expenses.toLocaleString()}`}
          icon={<TrendingDown size={22} />}
          color="red"
          description="Posted and reversed accounting activity"
        />

        {/* Net Profit */}

        <StatCard
          title="Net Profit"
          value={`₦${stats.netProfit.toLocaleString()}`}
          icon={<BadgeDollarSign size={22} />}
          color="amber"
          description="Revenue less expenses"
        />

        {/* Outstanding */}

        <StatCard
          title="Outstanding"
          value={`₦${stats.outstanding.toLocaleString()}`}
          icon={<CircleDollarSign size={22} />}
          color="red"
          description="Customer balances"
        />

      </div>

    </section>
  );
}