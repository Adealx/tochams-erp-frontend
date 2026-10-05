"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
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

function FinancialCard({
  title,
  value,
  description,
  icon,
  tone,
  indicator,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone: "green" | "red" | "amber" | "blue";
  indicator: React.ReactNode;
}) {
  const styles = {
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
      glow: "from-emerald-500/10",
      label: "text-emerald-600",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      border: "border-red-100",
      glow: "from-red-500/10",
      label: "text-red-600",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
      glow: "from-amber-500/10",
      label: "text-amber-600",
    },

    blue: {
      icon: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
      glow: "from-blue-500/10",
      label: "text-blue-600",
    },
  };

  const style = styles[tone];

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-[20px]
        border
        ${style.border}
        bg-white
        px-5
        py-5
        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]
      `}
    >
      {/* Soft background glow */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-gradient-to-br
          ${style.glow}
          to-transparent
          blur-2xl
        `}
      />

      <div className="relative z-10">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2.5">

            <div
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                ${style.icon}
              `}
            >
              {icon}
            </div>

            <span
              className={`
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                ${style.label}
              `}
            >
              {title}
            </span>

          </div>

          <div className="text-slate-300">
            {indicator}
          </div>

        </div>

        {/* Value */}

        <div className="mt-5">

          <p
            className="
              text-[clamp(1.45rem,2vw,2rem)]
              font-black
              tracking-[-0.045em]
              text-slate-950
            "
          >
            {value}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-medium
              text-slate-500
            "
          >
            {description}
          </p>

        </div>

        {/* Bottom status */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            border-t
            border-slate-100
            pt-3
          "
        >
          <span
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              ${style.icon}
            `}
          >
            {tone === "red" ? (
              <ArrowDownRight size={11} />
            ) : (
              <ArrowUpRight size={11} />
            )}
          </span>

          <span className="text-[10px] font-semibold text-slate-500">
            Live accounting figure
          </span>
        </div>

      </div>
    </div>
  );
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
      <FinancialCard
        title="Revenue"
        value={formatCurrency(stats.revenue)}
        icon={<TrendingUp size={18} />}
        tone="green"
        description="Posted sales revenue"
        indicator={<ArrowUpRight size={17} />}
      />

      <FinancialCard
        title="Expenses"
        value={formatCurrency(stats.expenses)}
        icon={<TrendingDown size={18} />}
        tone="red"
        description="Posted and reversed accounting activity"
        indicator={<ArrowDownRight size={17} />}
      />

      <FinancialCard
        title="Net Profit"
        value={formatCurrency(stats.netProfit)}
        icon={<BadgeDollarSign size={18} />}
        tone="amber"
        description="Revenue less expenses"
        indicator={<ArrowUpRight size={17} />}
      />

      <FinancialCard
        title="Receivables"
        value={formatCurrency(stats.outstanding)}
        icon={<CircleDollarSign size={18} />}
        tone="blue"
        description="Customer receivable balances"
        indicator={<ArrowUpRight size={17} />}
      />
    </div>
  );
}