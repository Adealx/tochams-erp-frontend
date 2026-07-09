"use client";

import StatCard from "@/components/cards/StatCard";

import {
  Wallet,
  TrendingUp,
  BadgeDollarSign,
  CircleDollarSign,
} from "lucide-react";

interface FinancialOverviewProps {
  stats: {
    storeValue: number;
    potentialSalesValue: number;
    potentialProfit: number;
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
          Financial performance and revenue metrics
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

        <StatCard
          title="Store Value"
          value={`₦${stats.storeValue.toLocaleString()}`}
          icon={<Wallet size={22} />}
          color="blue"
          description="Inventory value"
        />

        <StatCard
          title="Potential Sales"
          value={`₦${stats.potentialSalesValue.toLocaleString()}`}
          icon={<TrendingUp size={22} />}
          color="green"
          trend="+12%"
          trendDirection="up"
          description="Projected revenue"
        />

        <StatCard
          title="Potential Profit"
          value={`₦${stats.potentialProfit.toLocaleString()}`}
          icon={<BadgeDollarSign size={22} />}
          color="amber"
          trend="+8%"
          trendDirection="up"
          description="Estimated profit"
        />

        <StatCard
          title="Outstanding"
          value={`₦${stats.outstanding.toLocaleString()}`}
          icon={<CircleDollarSign size={22} />}
          color="red"
          trend="-5%"
          trendDirection="down"
          description="Customer balances"
        />

      </div>

    </section>
  );
}