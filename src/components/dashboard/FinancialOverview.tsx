"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

interface FinancialOverviewProps {
  stats: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    expenses: number;
    netProfit: number;
    outstanding: number;

    financialScope: "company" | "sales_rep";
    financialRole: "management" | "sales_rep";
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
  tone: "green" | "red" | "amber" | "blue" | "purple";
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

    purple: {
      icon: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
      glow: "from-purple-500/10",
      label: "text-purple-600",
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

  const isSalesRep =
    stats.financialRole === "sales_rep";

  /*
   * ==========================================================
   * SALES REP VIEW
   * ==========================================================
   *
   * Sales reps see their own commercial performance.
   *
   * Revenue
   * COGS
   * Gross Profit
   * Receivables
   *
   * We intentionally do NOT show company expenses or
   * company net profit here.
   *
   * ==========================================================
   */

  if (isSalesRep) {
    return (
      <div>

        {/* Section heading */}

        <div className="mb-4">

          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-900">
            My Financial Performance
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Your sales revenue, cost of goods, gross profit and
            customer receivables.
          </p>

        </div>

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
            title="My Revenue"
            value={formatCurrency(stats.revenue)}
            icon={<TrendingUp size={18} />}
            tone="green"
            description="Your posted sales revenue"
            indicator={<ArrowUpRight size={17} />}
          />

          <FinancialCard
            title="My COGS"
            value={formatCurrency(stats.cogs)}
            icon={<TrendingDown size={18} />}
            tone="red"
            description="Cost of goods sold"
            indicator={<ArrowDownRight size={17} />}
          />

          <FinancialCard
            title="My Gross Profit"
            value={formatCurrency(stats.grossProfit)}
            icon={<BadgeDollarSign size={18} />}
            tone="amber"
            description="Revenue less COGS"
            indicator={<ArrowUpRight size={17} />}
          />

          <FinancialCard
            title="My Receivables"
            value={formatCurrency(stats.outstanding)}
            icon={<CircleDollarSign size={18} />}
            tone="blue"
            description="Customer balances on your invoices"
            indicator={<ArrowUpRight size={17} />}
          />

        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * MANAGEMENT VIEW
   * ==========================================================
   *
   * Management roles see the official company-wide
   * financial overview.
   *
   * ==========================================================
   */

  return (
    <div>

      {/* Section heading */}

      <div className="mb-4">

        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-900">
          Company Financial Overview
        </h2>

        <p className="mt-1 text-xs font-medium text-slate-500">
          Company-wide financial performance from posted
          accounting entries.
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-6
        "
      >

        <FinancialCard
          title="Revenue"
          value={formatCurrency(stats.revenue)}
          icon={<TrendingUp size={18} />}
          tone="green"
          description="Posted company sales revenue"
          indicator={<ArrowUpRight size={17} />}
        />

        <FinancialCard
          title="COGS"
          value={formatCurrency(stats.cogs)}
          icon={<TrendingDown size={18} />}
          tone="red"
          description="Cost of goods sold"
          indicator={<ArrowDownRight size={17} />}
        />

        <FinancialCard
          title="Gross Profit"
          value={formatCurrency(stats.grossProfit)}
          icon={<BadgeDollarSign size={18} />}
          tone="amber"
          description="Revenue less COGS"
          indicator={<ArrowUpRight size={17} />}
        />

        <FinancialCard
          title="Expenses"
          value={formatCurrency(stats.expenses)}
          icon={<TrendingDown size={18} />}
          tone="red"
          description="Posted operating expenses"
          indicator={<ArrowDownRight size={17} />}
        />

        <FinancialCard
          title="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon={<WalletCards size={18} />}
          tone="purple"
          description="Gross profit less expenses"
          indicator={<ArrowUpRight size={17} />}
        />

        <FinancialCard
          title="Receivables"
          value={formatCurrency(stats.outstanding)}
          icon={<CircleDollarSign size={18} />}
          tone="blue"
          description="Company customer balances"
          indicator={<ArrowUpRight size={17} />}
        />

      </div>

    </div>
  );
}